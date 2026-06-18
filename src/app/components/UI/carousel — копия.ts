import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { twMerge } from "tailwind-merge";
import Autoplay from 'embla-carousel-autoplay';
import EmblaCarousel, {
  EmblaOptionsType,
  EmblaCarouselType,
} from "embla-carousel";
import { Subject } from "rxjs";

@Component({
  selector: "ui-carousel",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      [class]="
        twMerge(
          'relative mx-auto',
          scaled ? 'max-w-[102rem]' : 'max-w-[88rem]',
          className
        )
      "
      [style]="{
        '--slide-height': currentHeight,
        '--slide-spacing': currentSpacing,
        '--slide-size': currentSize,
      }"
    >
      <ng-container *ngIf="!hideMask">
        <div
          class="absolute h-full w-[25%] bg-[linear-gradient(to_right,white_12%,transparent_100%)] dark:bg-[linear-gradient(to_right,var(--p-surface-950)_12%,transparent_100%)] left-0 z-10 pointer-events-none"
        ></div>
        <div
          class="absolute h-full w-[25%] bg-[linear-gradient(to_left,white_12%,transparent_100%)] dark:bg-[linear-gradient(to_left,var(--p-surface-950)_12%,transparent_100%)] right-0 z-10 pointer-events-none"
        ></div>
      </ng-container>

      <div #emblaRef [ngClass]="mergedClasses">
        <div
          [ngClass]="{
            'embla__container py-4 !flex touch-pan-y touch-pinch-zoom ml-[calc(var(--slide-spacing)*-1)] [backface-visibility:hidden]':
              !scaled,
            'flex ml-[calc(var(--slide-spacing)*-1)] py-8 touch-pan-y touch-pinch-zoom':
              scaled,
          }"
        >
          <ng-content></ng-content>
        </div>
      </div>

      <div
        *ngIf="!hideButtons"
        class="mt-8 mx-auto w-fit flex items-center gap-6"
      >
        <button
          class="w-32 h-12 rounded-full flex items-center justify-center shadow-stroke dark:shadow-black-card border-0 dark:border border-white/12"
          type="button"
          [disabled]="prevBtnDisabled"
          (click)="scrollPrev()"
        >
          <i class="pi pi-arrow-left !text-xl"></i>
        </button>
        <button
          class="w-32 h-12 rounded-full flex items-center justify-center shadow-stroke dark:shadow-black-card border-0 dark:border border-white/12"
          type="button"
          [disabled]="nextBtnDisabled"
          (click)="scrollNext()"
        >
          <i class="pi pi-arrow-right !text-xl"></i>
        </button>
      </div>
      <div
  *ngIf="!hideDots"
  class="mt-6 flex justify-center gap-3"
>
  <button
    *ngFor="let dot of dots"
    type="button"
    (click)="scrollTo(dot)"
    class="h-3 w-3 rounded-full transition-all duration-300"
    [ngClass]="{
      'bg-primary scale-125': selectedIndex === dot,
      'bg-gray-300 dark:bg-white/20': selectedIndex !== dot
    }"
  ></button>
</div>
    </section>
  `,
})
export class UICarousel {

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  @Input() className: string = "";
  @Input() breakpoints: Record<string, Partial<UICarouselBreakpoint>> = {};
  @Input() scaled: boolean = false;
  @Input() scale: number = 0.36;
  @Input() height: string = "25rem";
  @Input() spacing: string = "1rem";
  @Input() size: string = "20%";
  @Input() hideMask: boolean = false;
  @Input() hideButtons: boolean = false;
  @Input() refContainerClass: string = "";
  @Input() options: EmblaOptionsType = {};
  @Input() autoPlay = false;
  @Input() autoPlayDelay = 4000;
  @Input() hideDots = true;
  @Input() autoPlayStopOnInteraction = true;
  @Input() dotActiveClass = 'bg-primary scale-125';
  @Input() dotInactiveClass = 'bg-gray-300 dark:bg-white/20';
  @ViewChild("emblaRef") emblaRef!: ElementRef;

  public emblaApi!: EmblaCarouselType | null;
  public autoplayPlugin?: any;
  public prevBtnDisabled: boolean = false;
  public nextBtnDisabled: boolean = false;
  public tweenNodes: HTMLElement[] = [];
  public tweenFactor: number = 0;
  public dots: number[] = [];
  public selectedIndex = 0;
  public currentSize = this.size;
  public currentSpacing = this.spacing;
  public currentHeight = this.height;
  public isSingleSlide = false;
  public emblaApiSubject = new Subject<EmblaCarouselType | null>();

  twMerge = twMerge;

  get mergedClasses(): string {
    return twMerge(
      `overflow-hidden ${!this.scaled ? "block" : ""}`,
      this.refContainerClass
    );
  }


  private applyBreakpoints(): void {
    this.currentSize = this.size;
    this.currentSpacing = this.spacing;
    this.currentHeight = this.height;

    const width = window.innerWidth;

    const match = Object.entries(this.breakpoints)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .find(([bp]) => width <= Number(bp));

    if (!match) {
      return;
    }

    const [, config] = match;

    this.currentSize = config.size ?? this.currentSize;
    this.currentSpacing = config.spacing ?? this.currentSpacing;
    this.currentHeight = config.height ?? this.currentHeight;

    this.isSingleSlide = this.currentSize === '100%';
  }

  scrollTo(index: number) {
    this.emblaApi?.scrollTo(index);
  }


  private initDots() {
    if (!this.emblaApi) return;

    this.dots = this.emblaApi.scrollSnapList().map((_, index) => index);
    this.selectedIndex = this.emblaApi.selectedScrollSnap();
  }

  get tweenFactorBase() {
    return this.scale ?? 0.36;
  }

  ngAfterViewInit() {
    this.applyBreakpoints();

    window.addEventListener('resize', () => {
      this.applyBreakpoints();
      this.cdr.detectChanges();
    });

    this.initializeEmbla();
  }

  initializeEmbla() {
    if (this.emblaRef) {
      const plugins: any[] = [];

      if (this.autoPlay) {
        this.autoplayPlugin = Autoplay({
          delay: this.autoPlayDelay,
          stopOnInteraction: this.autoPlayStopOnInteraction
        });

        plugins.push(this.autoplayPlugin);
      }

      this.emblaApi = EmblaCarousel(
        this.emblaRef.nativeElement,
        this.options,
        plugins
      );


      this.emblaApiSubject.next(this.emblaApi);

      if (!this.emblaApi) return;

      this.updateButtonStates();
      this.initDots();

      if (this.scaled) {
        this.setTweenNodes();
        this.setTweenFactor();
        this.tweenScale();
      }

      this.emblaApi.on("select", () => {
        this.selectedIndex = this.emblaApi?.selectedScrollSnap() ?? 0;
      });

      this.emblaApi.on("reInit", () => {
        this.updateButtonStates();
        this.initDots();
        if (this.scaled) {
          this.setTweenNodes();
          this.setTweenFactor();
          this.tweenScale();
        }
      });

      this.emblaApi.on("scroll", () => {
        this.updateButtonStates();
        if (this.scaled) {
          this.tweenScale("scroll");
        }
      });




      this.emblaApi.on("slideFocus", () => {
        this.updateButtonStates();
        if (this.scaled) {
          this.tweenScale();
        }
      });
    }
  }

  play() {
    this.autoplayPlugin?.play();
  }

  stop() {
    this.autoplayPlugin?.stop();
  }

  reset() {
    this.autoplayPlugin?.reset();
  }

  updateButtonStates() {
    if (!this.emblaApi) return;
    this.prevBtnDisabled = !this.emblaApi.canScrollPrev();
    this.nextBtnDisabled = !this.emblaApi.canScrollNext();
  }

  setTweenNodes() {
    if (!this.emblaApi || !this.scaled) return;
    this.tweenNodes = this.emblaApi
      .slideNodes()
      .map((slideNode) => slideNode.querySelector(".embla__slide__item"))
      .filter((node): node is HTMLElement => node !== null);
  }

  setTweenFactor() {
    if (!this.emblaApi || !this.scaled) return;
    this.tweenFactor =
      this.tweenFactorBase * this.emblaApi.scrollSnapList().length;
  }

  tweenScale(eventName?: string) {
    if (!this.emblaApi || !this.scaled) return;

    const engine = this.emblaApi.internalEngine();
    const scrollProgress = this.emblaApi.scrollProgress();
    const slidesInView = this.emblaApi.slidesInView();

    this.emblaApi
      .scrollSnapList()
      .forEach((scrollSnap: number, snapIndex: number) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex: number) => {
          if (eventName === "scroll" && !slidesInView.includes(slideIndex))
            return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem: any) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * this.tweenFactor);
          const scale = this.numberWithinRange(tweenValue, 0, 1).toString();
          const tweenNode = this.tweenNodes[slideIndex];

          if (tweenNode) {
            tweenNode.style.transform = `scale(${scale})`;
          }
        });
      });
  }

  numberWithinRange(number: number, min: number, max: number): number {
    return Math.min(Math.max(number, min), max);
  }

  scrollNext() {
    this.emblaApi?.scrollNext();
  }

  scrollPrev() {
    this.emblaApi?.scrollPrev();
  }

  ngOnDestroy() {
    if (this.emblaApi) {
      this.emblaApi.destroy();
    }
  }
}

export interface UICarouselBreakpoint {
  size?: string;
  spacing?: string;
  height?: string;
}
