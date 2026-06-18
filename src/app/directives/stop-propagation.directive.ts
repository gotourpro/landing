import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[stopPropagation]',
  standalone: true
})
export class StopPropagationDirective {
  @HostListener('click', ['$event'])
  @HostListener('mousedown', ['$event'])
  stopEvent(event: Event): void {
    event.stopPropagation();
  }
}
