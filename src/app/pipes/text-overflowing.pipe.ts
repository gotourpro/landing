import { NgZone, OnDestroy, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'isTextOverflowing',
  pure: false,
  standalone: true,
})
export class IsTextOverflowingPipe implements PipeTransform, OnDestroy {
  private observer: ResizeObserver | null = null;
  private currentElement: HTMLElement | null = null;
  private callback: (isOverflowing: boolean) => void = () => {};

  constructor(private ngZone: NgZone) {}

  transform(element: HTMLElement | null, callback?: (isOverflowing: boolean) => void): boolean {
    if (!element) return false;
    
    if (this.currentElement !== element) {
      this.cleanupObserver();
      this.currentElement = element;
      this.callback = callback || (() => {});
      this.setupObserver(element);
    }
    
    return this.checkOverflow(element);
  }

  private setupObserver(element: HTMLElement) {
    this.observer = new ResizeObserver(() => {
      this.ngZone.run(() => {
        const isOverflowing = this.checkOverflow(element);
        this.callback(isOverflowing);
      });
    });
    this.observer.observe(element);
  }

  private checkOverflow(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  private cleanupObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  ngOnDestroy() {
    this.cleanupObserver();
  }
}