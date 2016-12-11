import { City } from './city';
import { Weather, WeatherForecast } from './weather';

/**
 * Hold weather data for a city. Built from the http client of the weather api
 */
export class WeatherAtCity {
  city: City;
  current: Weather;
  forecast: WeatherForecast[] = []; // initialize to an empty array
}
