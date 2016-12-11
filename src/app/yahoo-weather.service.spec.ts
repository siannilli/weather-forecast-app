/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { YahooWeatherService } from './yahoo-weather.service';

describe('YahooWeatherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YahooWeatherService]
    });
  });

  it('should ...', inject([YahooWeatherService], (service: YahooWeatherService) => {
    expect(service).toBeTruthy();
  }));
});
