/**
 * Scalar value of a weather data (eg. Temp { value: 30, unit: 'C' }, Pressure { value: 3023, unit: 'nb' }, )
 */
export class ScalarValue {
  constructor(public value: number, public unit: string) {

  }

}

/**
 * Describes wind parameters eg. speed ({ value: 70, unit: 'km/h' }), direction (as minute)
 */
export class Wind {
  speed: ScalarValue;
  direction: number;
}

/**
 * Basic weather forecast data
 */
export class WeatherForecast  {
  code: number;
  text: string;
  date: Date;
  high: ScalarValue;
  low: ScalarValue;
}

/**
 * Extended weather data as per current (call) time
 */
export class Weather extends WeatherForecast {
  temperature: ScalarValue;
  humidity: ScalarValue;
  pressure: ScalarValue;
  wind: Wind;
}
