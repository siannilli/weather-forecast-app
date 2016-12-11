import { Component, OnInit, Input, Attribute } from '@angular/core';
import { WeatherAtCity  } from '../models/cweather';

import { Weather, WeatherForecast } from '../models/weather';
import { Location, City } from '../models/city';

import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  private _cityName: string = undefined;
  /**
   * Wraps attribute databind in a property setter to trigger reload of
   * weather forecast
   */
  @Input() set city (name: string) {
    this._cityName = name;
    this.loadForecastForSelectedCity();
  }
  get city(): string {
    return this._cityName;
  }

  weatherAtCity: WeatherAtCity = undefined;
  private tmpErrorMessage: string = undefined;

  constructor(private weatherService:WeatherService) { }

  private loadForecastForSelectedCity() {
      if (this._cityName) {

      console.log(`Loading weather data for ${this._cityName}`);

      this.weatherService.getWeatherData(this._cityName)
        .then( (response: WeatherAtCity ) => this.weatherAtCity = response )
        .catch ((error) => {
          console.log (JSON.stringify(error));
          this.weatherAtCity = undefined;
          // TODO: push the error message into a toast
          this.tmpErrorMessage = error.message || JSON.stringify(error);
         });
      } else {
        this.weatherAtCity = undefined;
      }
  }

  ngOnInit() {
    /** Loads the forecast if a city is already selected */
    this.loadForecastForSelectedCity();
  }

}
