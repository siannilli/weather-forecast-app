import { City } from './city';
import { Weather, WeatherForecast } from './weather';

/**
 * Hold weather data for a city. Built from the http client of the weather api
 */
export class WeatherAtCity {
  created: Date = new Date();
  ttl: number; // minutes
  city: City;
  current: Weather;
  forecast: WeatherForecast[] = []; // initialize to an empty array

  expired(): boolean {
    return (Date.now().valueOf() - this.created.valueOf() > (this.ttl * 6000));
  }

}
