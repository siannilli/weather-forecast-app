import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { WeatherService } from './weather.service';
import { WeatherAtCity } from './models/cweather';
import { City, Location } from './models/city';
import { ScalarValue, Weather, WeatherForecast, Wind } from './models/weather';

/**
 * Base abstract class with parser logic of Yahoo's weather json response
 */
export abstract class BaseYahooWeatherService implements WeatherService {
  getWeatherData(cityName: string, forecast_days?: number): Promise<WeatherAtCity> {
    return null;
  }

  /**
   * parse Yahoo's json response from the remote service (or from local city's file)
   * and return a CityWeather object
   */
  protected parseRemoteResponse(remoteResponse: any): WeatherAtCity {
    if (!(remoteResponse && remoteResponse.query && remoteResponse.query.results)) {
      throw { message: 'Wrong response from weather service. Try again.' };
    }

    // shortcuts to json parts
    let location: any = remoteResponse.query.results.channel.location;
    let item: any = remoteResponse.query.results.channel.item;
    let units: any = remoteResponse.query.results.channel.units;
    let wind: any = remoteResponse.query.results.channel.wind;
    let atmosphere: any = remoteResponse.query.results.channel.atmosphere;
    let astronomy: any = remoteResponse.query.results.channel.astronomy;
    let forecast: any[] = remoteResponse.query.results.channel.item.forecast;

    let forecastToday: any = forecast[0];

    let retObj: WeatherAtCity = new WeatherAtCity();

    // set ttl (numebers of minutes to keep in cache)
    retObj.ttl = remoteResponse.query.results.channel.ttl;

    retObj.city = new City();
    retObj.city.name = location.city;
    retObj.city.country = location.country;
    retObj.city.region = location.region;

    retObj.city.location = new Location();
    retObj.city.location.lat = item.lat;
    retObj.city.location.lon = item.long;

    retObj.current = new Weather();
    retObj.current.code = item.condition.code;
    retObj.current.text = item.condition.text;
    retObj.current.date = new Date(Date.parse(forecast[0].date));
    retObj.current.temperature = new ScalarValue(item.condition.temp, units.temperature);
    retObj.current.wind = new Wind();
    retObj.current.wind.direction = wind.direction;
    retObj.current.wind.speed = new ScalarValue(wind.speed, units.speed);

    retObj.current.humidity = new ScalarValue(atmosphere.humidity, '%');
    retObj.current.pressure = new ScalarValue(atmosphere.pression, units.pression);
    retObj.current.low = new ScalarValue(forecastToday.low, units.temperature);
    retObj.current.high = new ScalarValue(forecastToday.high, units.temperature);

    // parse forecast data from 2nd element (1st is today)
    for (let i = 1; i < forecast.length; i++) {
      let fc: WeatherForecast = new WeatherForecast();
      fc.code = forecast[i].code;
      fc.text = forecast[i].text;
      fc.date = new Date(Date.parse(forecast[i].date));
      fc.high = new ScalarValue(forecast[i].high, units.temperature);
      fc.low = new ScalarValue(forecast[i].low, units.temperature);

      retObj.forecast.push(fc);
    }

    return retObj;
  }

  /**
   * Check if typed city name is valid for the weather service
   */
  normalizeCityName(city: string): Promise<string> {
    return null;
  }

}

/**
 * Remote service client. Injected when environment.useInMemoryService === false
 */
@Injectable()
export class YahooWeatherService extends BaseYahooWeatherService {
  private cache: { [key: string]: WeatherAtCity } = {};

  readonly YAHOO_WHEATHER_SERVICE_URL = 'https://query.yahooapis.com/v1/public/yql?q={q}&format=json';
  constructor(private http: Http) { super(); }

  getWeatherData(cityName: string, forecast_days?: number): Promise<WeatherAtCity> {
    // check if the response is in cache and still valid
    if (this.cache[cityName] !== undefined) {
      let cacheItem: WeatherAtCity = this.cache[cityName];
      if (!cacheItem.expired()) {
        return Promise.resolve(cacheItem);
      }
    }

    // response is not in cache or cache expired, calling the remote service
    let yql = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${cityName}") and u='c'`;

    return this.http.get(this.YAHOO_WHEATHER_SERVICE_URL.replace('{q}', yql))
      .map(res => {
        this.cache[cityName] = this.parseRemoteResponse(res.json());
        return this.cache[cityName];
      })
      .toPromise();
  }

  normalizeCityName(cityName: string): Promise<string> {
    // response is not in cache or cache expired, calling the remote service
    let yql = `select name, country from geo.places(1) where text="${cityName}"`;

    return this.http.get(this.YAHOO_WHEATHER_SERVICE_URL.replace('{q}', yql))
      .map(res => {
        let result = this.extractNormalizedCity(res.json());
        if (result) {
          return result;
        }

        throw { message: `Cannot find city ${cityName}` };
      })
      .toPromise();
  }

  /**
   * return city name from
   */
  private extractNormalizedCity(document: any): string {
    if (document.query && document.query.results && document.query.results.place) {
      return `${document.query.results.place.name},  ${document.query.results.place.country.code}`;
    }

    return null;
  }

}

/**
 * For development we can use an in-memory service. It look ups a static dictionary initialized
 * with the json files under ../json folder.
 *
 * Injected when environment.useInMemoryService === true
 */
@Injectable()
export class InMemoryYahooWeatherService extends BaseYahooWeatherService {

  private serviceData: { [key: string]: string } = {};

  getWeatherData(cityName: string, forecast_days = 3): Promise<WeatherAtCity> {
    if (this.serviceData[cityName] === undefined) {
      return Promise.reject({ message: 'Cannot find city name ' + cityName });
    }

    try {
      let remoteResponse: any = this.serviceData[cityName];
      return Promise.resolve(this.parseRemoteResponse(remoteResponse));
    } catch (error) {
      return Promise.reject(error);
    }

  }

  /**
   * Initialize array of static city data
   */
  constructor() {
    super();
    this.serviceData['Rome, IT'] = require('../json/forecast-rome.json');
    this.serviceData['Vienna, AT'] = require('../json/forecast-vienna.json');
    this.serviceData['Zug, CH'] = require('../json/forecast-zug.json');
  }

  normalizeCityName(city: string): Promise<string> {
    for (let key in this.serviceData) {
      if (key.startsWith(city)) {
        return Promise.resolve(key);
      }
    }
    return Promise.reject({ message: `Cannot find city ${city}` });
  }

}
