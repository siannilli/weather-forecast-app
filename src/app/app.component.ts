import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Weather forecast application assessment';
  locations: string[] = ['Rome, IT', 'Zug, CH', 'Vienna, AT'];
  selectedCity: string = this.locations[0];
  mobileMenuHidden: boolean = true;
  validationError: string = undefined;

  /**
   * constructor required to get a reference to the weather service.
   * we use it to check city name before adding it to the list
   */
  constructor(private weatherService: WeatherService) { }

  /**
   * handles delete city command removing the city name from locations array
   */
  removeCity(cityName) {
    let idx = this.locations.findIndex(item => item === cityName);
    if (idx >= 0) {
      this.locations.splice(idx, 1);
    }

  }

  /**
   * validates city name currently typed into the find location input box.
   * if the city name matches with the results from the configured remote service
   *  the city name is pushed into the locations array and selected to load weather data
   */
  addNew(input: FormControl) {
    // Check if it's a valid name
    this.weatherService.normalizeCityName(input.value)
      .then((cityName: string) => {
        // add the value as typed into the forms
        this.locations.push(cityName);
        input.reset();
        this.validationError = undefined;

        // select the new city and load weather data
        this.selectedCity = this.locations[this.locations.length - 1];

      })
      .catch((error) => {
        this.validationError = error.message || JSON.stringify(error);
        console.log(this.validationError);
        });
  }
}
