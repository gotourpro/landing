import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    Renderer2,
    inject
} from '@angular/core';

import { animate, stagger } from 'animejs';
import { TextAnimationType } from './text-animation.type';
import SplitType from 'split-type';

@Directive({
    selector: '[appTextAnimation]',
    standalone: true
})
export class TextAnimationDirective implements AfterViewInit, OnDestroy {

    private readonly elementRef = inject(ElementRef<HTMLElement>);
    private readonly renderer = inject(Renderer2);

    private observer?: IntersectionObserver;
    private splitType?: SplitType;

    @Input('appTextAnimation')
    animation: TextAnimationType = 'fade';

    @Input()
    delay = 0;

    @Input()
    stagger = 20;

    @Input()
    duration = 1200;

    ngAfterViewInit(): void {

        const element = this.elementRef.nativeElement;
        if (this.animation === 'rotate') {
            this.renderer.setStyle(element, 'perspective', '400px');
        }

        this.renderer.setStyle(element, 'visibility', 'hidden');

        const text = element.textContent ?? '';

        if (!text.trim()) {
            this.renderer.removeStyle(element, 'visibility');
            return;
        }

        this.splitType = new SplitType(element, {
            types: ['words', 'chars']
        });

        const chars = this.splitType.chars as HTMLElement[];

        chars.forEach(char => {

            this.renderer.setStyle(char, 'display', 'inline-block');
            this.renderer.setStyle(char, 'opacity', '0');
        });

        this.renderer.setStyle(element, 'visibility', 'visible');

        this.observer = new IntersectionObserver(
            entries => {

                if (!entries[0]?.isIntersecting) {
                    return;
                }

                this.animate(chars);

                this.observer?.disconnect();
            },
            {
                threshold: 0.15
            }
        );

        this.observer.observe(element);
    }

    private animate(chars: HTMLElement[]): void {

        const config = this.getAnimationConfig();

        animate(chars, {
            ...config,
            delay: stagger(this.stagger, {
                start: this.delay
            }),
            duration: this.duration,
            ease: 'outExpo'
        });
    }

    private getAnimationConfig() {

        switch (this.animation) {

            case 'left':
                return {
                    translateX: [-20, 0],
                    opacity: [0, 1]
                };

            case 'right':
                return {
                    translateX: [20, 0],
                    opacity: [0, 1]
                };

            case 'up':
                return {
                    translateY: [80, 0],
                    opacity: [0, 1]
                };

            case 'down':
                return {
                    translateY: [-20, 0],
                    opacity: [0, 1]
                };

            case 'rotate':
                return {
                    rotateX: ['50deg', '0deg'],
                    opacity: [0, 1]
                };

            case 'scale':
                return {
                    scale: [0.7, 1],
                    opacity: [0, 1]
                };

            case 'fade':
            default:
                return {
                    opacity: [0, 1]
                };
        }
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.splitType?.revert();
    }
}