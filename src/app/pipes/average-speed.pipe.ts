import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'averageSpeed',
    standalone: true,
})
export class AverageSpeedPipe implements PipeTransform {

    public transform(distanceInMeters: number, durationInSeconds: number): string {
        if (!distanceInMeters || !durationInSeconds) {
            return '0.00';
        }

        const distanceInKm = distanceInMeters / 1000;
        const durationInHours = durationInSeconds / 3600;

        const averageSpeed = distanceInKm / durationInHours;
        return averageSpeed.toFixed(2);
    }

}