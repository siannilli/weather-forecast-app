import { Injectable } from '@angular/core';
import { City, Location } from './models/city';
import { ScalarValue, Weather, WeatherForecast, Wind } from './models/weather';
import { WeatherAtCity } from './models/cweather';

@Injectable()
export class WeatherService {

  getWeatherData(cityName: string, forecast_days?: number): Promise<WeatherAtCity> {
    return null;
  }
}

@Injectable()
export class WeatherServiceInMemory implements WeatherService {

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
   * parse json response from the remote service (or from local city's file)
   * and return a CityWeather object
   */
  private parseRemoteResponse(remoteResponse: any): WeatherAtCity {
    if (!(remoteResponse && remoteResponse.query && remoteResponse.query.results)) {
      throw { message: 'Wrong response from weather service.' };
    }

    // shortcuts to response parts
    let location: any = remoteResponse.query.results.channel.location;
    let item: any = remoteResponse.query.results.channel.item;
    let units: any = remoteResponse.query.results.channel.units;
    let wind: any = remoteResponse.query.results.channel.wind;
    let atmosphere: any = remoteResponse.query.results.channel.atmosphere;
    let astronomy: any = remoteResponse.query.results.channel.astronomy;
    let forecast: any[] = remoteResponse.query.results.channel.item.forecast;

    let forecastToday: any = forecast[0];

    let retObj: WeatherAtCity = new WeatherAtCity();

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
   * Initialize array of city static data
   */
  constructor() {
    this.serviceData['Rome, IT'] = require('../json/forecast-rome.json');
    this.serviceData['Vienna, AT'] = require('../json/forecast-vienna.json');
    this.serviceData['Zug, CH'] = require('../json/forecast-zug.json');
  }

}
