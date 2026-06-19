import { Directive, ElementRef, inject, Input, Renderer2, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';
import SplitType from 'split-type';

export type TextAnimationType = 'left' | 'right' | 'up' | 'down' | 'rotate' | 'scale' | 'fade';

@Directive({
    selector: '[appTextAnimation]',
    standalone: true
})
export class TextAnimationDirective implements AfterViewInit, OnDestroy {
    private readonly elementRef = inject(ElementRef<HTMLElement>);
    private readonly renderer = inject(Renderer2);
    private readonly ngZone = inject(NgZone);
    private readonly translateService = inject(TranslateService);

    private intersectionObserver?: IntersectionObserver;
    private langChangeSub?: Subscription;
    private splitType?: SplitType;
    private activeAnimations: Animation[] = [];

    private isVisible = false;
    private isFirstLoad = true;

    @Input('appTextAnimation') animation: TextAnimationType = 'fade';
    @Input() translationKey = '';
    @Input() delay = 0;
    @Input() stagger = 20;
    @Input() duration = 1200;

    public ngAfterViewInit(): void {
        if (this.shouldSkipAnimation()) {
            this.loadStaticTextOnly();
            return;
        }

        const element = this.elementRef.nativeElement;

        if (this.animation === 'rotate') {
            this.renderer.setStyle(element, 'perspective', '400px');
        }

        this.intersectionObserver = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                if (!entries[0]?.isIntersecting) return;
                this.isVisible = true;
                this.loadAndAnimate();
                this.intersectionObserver?.disconnect();
            },
            { threshold: 0.15 }
        );
        this.intersectionObserver.observe(element);

        this.langChangeSub = this.translateService.onLangChange.subscribe(() => {
            if (this.isVisible) {
                this.ngZone.runOutsideAngular(() => {
                    this.loadAndAnimate();
                });
            }
        });
    }

    private shouldSkipAnimation(): boolean {
        if (typeof window === 'undefined') return true;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return true;
        const nav = navigator as any;
        const isLowMemory = nav.deviceMemory && nav.deviceMemory < 4;
        const isLowCpu = nav.hardwareConcurrency && nav.hardwareConcurrency < 4;

        if (isLowMemory || isLowCpu) {
            return true;
        }

        return false;
    }

    private loadStaticTextOnly(): void {
        if (!this.translationKey) return;

        this.langChangeSub = this.translateService.stream(this.translationKey).subscribe((translatedText: string) => {
            this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', translatedText);
        });
    }

    private loadAndAnimate(): void {
        if (!this.translationKey) return;

        this.translateService
            .get(this.translationKey)
            .pipe(take(1))
            .subscribe((translatedText: string) => {
                const element = this.elementRef.nativeElement;

                this.cleanupAnimations();
                this.splitType?.revert();

                this.renderer.setProperty(element, 'textContent', translatedText);

                if (!translatedText.trim()) return;

                this.splitType = new SplitType(element, { types: ['words', 'chars'] });
                const chars = this.splitType.chars as HTMLElement[];

                if (this.isFirstLoad) {
                    this.isFirstLoad = false;

                    chars.forEach(char => {
                        this.renderer.setStyle(char, 'display', 'inline-block');
                        this.renderer.setStyle(char, 'opacity', '0');
                        this.renderer.setStyle(char, 'will-change', 'transform, opacity');
                    });

                    const keyframes = this.getKeyframes();
                    chars.forEach((char, index) => {
                        const calculatedDelay = this.delay + (index * this.stagger);
                        const anim = char.animate(keyframes, {
                            duration: this.duration,
                            delay: calculatedDelay,
                            fill: 'forwards',
                            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
                        });
                        this.activeAnimations.push(anim);
                    });
                } else {
                    chars.forEach(char => {
                        this.renderer.setStyle(char, 'display', 'inline-block');
                        this.renderer.setStyle(char, 'opacity', '1');
                        this.renderer.setStyle(char, 'transform', 'none');
                    });
                    element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
                }
            });
    }

    private cleanupAnimations(): void {
        this.activeAnimations.forEach(anim => anim.cancel());
        this.activeAnimations = [];
    }

    private getKeyframes(): Keyframe[] {
        switch (this.animation) {
            case 'left': return [{ transform: 'translateX(-20px)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }];
            case 'right': return [{ transform: 'translateX(20px)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }];
            case 'up': return [{ transform: 'translateY(80px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }];
            case 'down': return [{ transform: 'translateY(-20px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }];
            case 'rotate': return [{ transform: 'rotateX(50deg)', opacity: 0 }, { transform: 'rotateX(0deg)', opacity: 1 }];
            case 'scale': return [{ transform: 'scale(0.7)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }];
            case 'fade':
            default: return [{ opacity: 0 }, { opacity: 1 }];
        }
    }

    public ngOnDestroy(): void {
        this.intersectionObserver?.disconnect();
        this.langChangeSub?.unsubscribe();
        this.cleanupAnimations();
        this.splitType?.revert();
    }
}
