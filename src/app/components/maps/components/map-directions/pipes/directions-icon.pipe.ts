import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'directionsIcon',
  standalone:true
})
export class DirectionsIconPipe implements PipeTransform {
  public transform(step: any): string {
    if (!step || !step.maneuver) {
      return '';
    }

    let icon = step.maneuver.modifier
      ? step.maneuver.modifier.replace(/\s+/g, '-').toLowerCase()
      : step.maneuver.type.replace(/\s+/g, '-').toLowerCase();

    if (['arrive', 'depart', 'waypoint'].includes(step.maneuver.type)) {
      icon = step.maneuver.type;
    }

    if (step.maneuver.type === 'roundabout' || step.maneuver.type === 'rotary') {
      icon = 'roundabout';
    }

    return icon;
  }
}