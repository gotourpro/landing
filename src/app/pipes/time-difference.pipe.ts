import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDifference',
  standalone:true
})
export class TimeDifferencePipe implements PipeTransform {
  transform(startDate: Date | string, endDate: Date | string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime(); // Difference in milliseconds

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  private padNumber(num: number): string {
    return num.toString().padStart(2, '0'); // Ensures 2-digit format
  }
}