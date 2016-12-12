import { Component, OnInit, Input, Attribute } from '@angular/core';
import { WeatherAtCity } from '../models/cweather';

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
  @Input() set city(name: string) {
    this.weatherAtCity = undefined;
    this._cityName = name;
    this.loadForecastForSelectedCity();
  }

  loading = false;

  get city(): string {
    return this._cityName;
  }

  weatherAtCity: WeatherAtCity = undefined;
  private undefinedMessage: string = undefined;

  constructor(private weatherService: WeatherService) { }

  private loadForecastForSelectedCity() {

    if (this._cityName) {
      this.loading = true;
      console.log(`Loading weather data for ${this._cityName}`);

      this.weatherService.getWeatherData(this._cityName)
        .then((response: WeatherAtCity) => {
          this.weatherAtCity = response;
          this.loading = false;
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          this.weatherAtCity = undefined;
          // TODO: push the error message into a toast
          this.undefinedMessage = error.message || JSON.stringify(error);
          this.loading = false;
        });
    } else {
      this.weatherAtCity = undefined;
    }
  }

  ngOnInit() {

  }

}
