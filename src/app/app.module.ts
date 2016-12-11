import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CityComponent } from './city/city.component';
import { ForecastComponent } from './forecast/forecast.component';

import { environment } from '../environments/environment';
import { WeatherService } from './weather.service';
import { YahooWeatherService, InMemoryYahooWeatherService } from './yahoo-weather.service';

let providers: any[] = [];

// add weather service provider according environment mode
providers.push({ provide: WeatherService, useClass: environment.useInMemoryService ? InMemoryYahooWeatherService : YahooWeatherService});

@NgModule({
  declarations: [
    AppComponent,
    CityComponent,
    ForecastComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
