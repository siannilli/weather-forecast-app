import { Injectable } from '@angular/core';

import { WeatherAtCity } from './models/cweather';

/**
 * Defines the token of the service to inject into the angular application.
 * Concrete class definitions that implement logic to the query the remote service (or an in-memory database)
 * are elsewhere (eg. yahoo-weather.service.ts)
 */
@Injectable()
export class WeatherService {

  getWeatherData(cityName: string, forecast_days?: number): Promise<WeatherAtCity> {
    return null;
  }

  normalizeCityName(cityName: string): Promise<string> {
    return null;
  }

}
