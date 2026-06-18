import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationInSeconds',
  standalone:true,
})
export class DurationInSecondsPipe implements PipeTransform {

  public transform(startDate: Date | string, endDate: Date | string): number {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end)) {
      throw new Error('Invalid date format');
    }

    const durationInSeconds = Math.abs((end - start) / 1000);

    return durationInSeconds;
  }
}