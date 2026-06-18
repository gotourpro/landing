import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationMinutes',
  standalone:true,
})
export class DurationMinutesPipe implements PipeTransform {
  transform(durationInSeconds: number): string {
    if (!durationInSeconds) return '0 мин';
    
    const minutes = Math.round(durationInSeconds / 60);
    return `${minutes} мин`;
  }
}