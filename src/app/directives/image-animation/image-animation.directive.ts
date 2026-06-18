import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    inject
} from '@angular/core';

import { animate } from 'animejs';
import { ImageAnimationType } from './types/image-animation.type';

@Directive({
    selector: '[appImageAnimation]',
    standalone: true
})
export class ImageAnimationDirective implements AfterViewInit, OnDestroy {

    private readonly elementRef = inject(ElementRef<HTMLElement>);

    private animationInstance: any;

    @Input('appImageAnimation')
    animation: ImageAnimationType = 'bounce';

    @Input()
    duration = 3000;

    ngAfterViewInit(): void {

        const element = this.elementRef.nativeElement;

        switch (this.animation) {

            case 'bounce':

                this.animationInstance = animate(element, {
                    translateY: [
                        { to: -15 },
                        { to: 0 }
                    ],
                    duration: this.duration,
                    ease: 'inOutSine',
                    loop: true
                });

                break;

            case 'bounceReverse':

                this.animationInstance = animate(element, {
                    translateY: [
                        { to: 15 },
                        { to: 0 }
                    ],
                    duration: this.duration,
                    ease: 'linear',
                    loop: true
                });

                break;

            case 'float':

                this.animationInstance = animate(element, {
                    translateY: [
                        { to: -10 },
                        { to: 10 }
                    ],
                    duration: this.duration,
                    ease: 'inOutSine',
                    alternate: true,
                    loop: true
                });

                break;

            case 'rotate':

                this.animationInstance = animate(element, {
                    rotate: '360deg',
                    duration: this.duration,
                    ease: 'linear',
                    loop: true
                });

                break;

            case 'pulse':

                this.animationInstance = animate(element, {
                    scale: [
                        { to: 1.08 },
                        { to: 1 }
                    ],
                    duration: this.duration,
                    ease: 'inOutSine',
                    loop: true
                });

                break;

            case 'bgSlide':

                this.animationInstance = animate(element, {
                    backgroundPositionX: ['0px', '-1000px'],
                    duration: this.duration,
                    ease: 'linear',
                    loop: true
                });

                break;
        }
    }

    ngOnDestroy(): void {

        this.animationInstance?.pause?.();
    }
}