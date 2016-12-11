import { Component, OnInit, Input } from '@angular/core';
import { WeatherForecast } from '../models/weather';
@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  @Input() forecast:WeatherForecast;

  constructor() { }

  ngOnInit() {
  }

}
