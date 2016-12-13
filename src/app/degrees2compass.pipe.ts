import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts direction expressed as degrees as cardinal points.
 */
@Pipe({
  name: 'degreesTocompass'
})
export class DegreesToCompassPipe implements PipeTransform {

  private cardinals: string[] = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];

  transform(value: any, args?: any): any {
    if (isNaN(value)) {
      return 'Wrong value';
    }

    let val = Math.floor((value / 45));
    return `${this.cardinals[(val % 8)]}`;

  }

}
