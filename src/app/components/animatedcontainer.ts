import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { twMerge } from "tailwind-merge";

@Component({
  selector: "animated-container",
  standalone: true,
  imports: [CommonModule],
  template: `
  
    <div #containerRef  [ngClass]="twMerge('h-full w-full', computedClass())">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    "[style.display]": "'contents'",
  },
})
export class AnimatedContainer {
  @Input() enterClass: string = "animate-slidefadein";
  @Input() className: any = "";
  @Input() delay: number = 0;
  @ViewChild("containerRef") containerRef!: ElementRef<HTMLDivElement>;

  twMerge = twMerge;

  isVisible: boolean = false;

  constructor(private _cdr: ChangeDetectorRef,) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const containerElement = this.containerRef.nativeElement;

      if (containerElement) {
        const observer = new IntersectionObserver(
          (entries, observerInstance) => {
            if (entries[0].isIntersecting) {
              setTimeout(() => {
                this.isVisible = true;
                this._cdr.detectChanges();
                this.computedClass();
                observerInstance.unobserve(containerElement);
              }, this.delay);
            }
          },
          { threshold: 0.01 }
        );

        observer.observe(containerElement);
      }
    });
  }

  computedClass(): string {
    let baseClass = this.isVisible
      ? "animate-duration-500 " + this.enterClass
      : "opacity-0";

    let dynamicClass =
      typeof this.className === "string"
        ? this.className
        : Object.entries(this.className)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(" ");

    return twMerge(baseClass, dynamicClass);
  }
}
