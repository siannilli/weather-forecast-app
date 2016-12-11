import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CityComponent } from './city/city.component';
import { ForecastComponent } from './forecast/forecast.component';

import { WeatherService, WeatherServiceInMemory } from './weather.service';

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
  providers: [{ provide: WeatherService, useClass: WeatherServiceInMemory}],
  bootstrap: [AppComponent]
})
export class AppModule { }
