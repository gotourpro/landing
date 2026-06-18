import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    inject
} from '@angular/core';

import SimpleParallax from 'simple-parallax-js/vanilla';

export type ParallaxOrientation =
    | 'up'
    | 'down'
    | 'left'
    | 'right'
    | 'up left'
    | 'up right'
    | 'down left'
    | 'down right';

@Directive({
    selector: '[appParallax]',
    standalone: true
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {

    private readonly elementRef =
        inject(ElementRef<HTMLImageElement>);

    private instance: any;

    @Input()
    orientation: ParallaxOrientation = 'up';

    @Input()
    scale = 1.4;

    @Input()
    overflow = false;

    @Input()
    delay = 0.4;

    @Input()
    transition = 'cubic-bezier(0,0,0,1)';

    @Input()
    maxTransition = 0;

    ngAfterViewInit(): void {

        this.instance = new SimpleParallax(
            this.elementRef.nativeElement,
            {
                orientation: this.orientation,
                scale: this.scale,
                overflow: this.overflow,
                delay: this.delay,
                transition: this.transition,
                maxTransition: this.maxTransition
            }
        );
    }

    ngOnDestroy(): void {
        this.instance?.destroy?.();
    }
}