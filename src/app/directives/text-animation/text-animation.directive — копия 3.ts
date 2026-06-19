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
    private hasAnimated = false;
    private skipNextAnimation = false;
    private isAnimating = false; // ФЛАГ: идет ли анимация прямо сейчас?

    @Input('appTextAnimation') animation: TextAnimationType = 'fade';
    @Input() translationKey = '';
    @Input() delay = 0;
    @Input() stagger = 20;
    @Input() duration = 1200;
    @Input() once = true;
    @Input() intersectionMargin = '-50px 0px -50px 0px';
    @Input() threshold = 0.15;

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
                const entry = entries[0];
                if (!entry) return;

                if (entry.isIntersecting) {
                    this.isVisible = true;

                    // Если анимация УЖЕ идет, игнорируем повторный запуск от дребезга скролла
                    if (this.isAnimating) return;

                    if (!this.once || !this.hasAnimated) {
                        this.loadAndAnimate();
                    }

                    if (this.once) {
                        this.intersectionObserver?.disconnect();
                    }
                } else {
                    this.isVisible = false;

                    // Сбрасываем буквы в скрытое состояние только если анимация НЕ идет в данный момент
                    if (!this.once && this.hasAnimated && !this.isAnimating) {
                        this.prepareCharsForAnimation();
                    }
                }
            },
            {
                threshold: this.threshold,
                rootMargin: this.intersectionMargin
            }
        );
        this.intersectionObserver.observe(element);

        this.langChangeSub = this.translateService.onLangChange.subscribe(() => {
            this.skipNextAnimation = true;
            // Принудительно сбрасываем флаг блокировки, так как смена языка приоритетнее скролла
            this.isAnimating = false;

            if (this.isVisible) {
                this.ngZone.runOutsideAngular(() => {
                    this.loadAndAnimate();
                });
            } else {
                this.loadAndAnimate();
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
        return !!(isLowMemory || isLowCpu);
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

                if (this.skipNextAnimation) {
                    this.skipNextAnimation = false;
                    this.showStaticChars();
                    if (this.isVisible) {
                        element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
                    }
                    return;
                }

                this.hasAnimated = true;
                this.isAnimating = true; // ВКЛЮЧАЕМ БЛОКИРОВКУ: процесс пошел
                this.prepareCharsForAnimation();

                const keyframes = this.getKeyframes();
                const chars = this.splitType.chars as HTMLElement[];
                let lastAnimation: Animation | null = null;

                chars.forEach((char, index) => {
                    const calculatedDelay = this.delay + (index * this.stagger);
                    const anim = char.animate(keyframes, {
                        duration: this.duration,
                        delay: calculatedDelay,
                        fill: 'forwards',
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
                    });
                    this.activeAnimations.push(anim);

                    // Запоминаем плеер последней буквы (она закончит анимацию позже всех)
                    if (index === chars.length - 1) {
                        lastAnimation = anim;
                    }
                });

                // Ждем окончания анимации последней буквы нативного Web Animations API
                if (lastAnimation) {
                    (lastAnimation as Animation).finished.then(() => {
                        this.isAnimating = false; // СНИМАЕМ БЛОКИРОВКУ: буквы полностью долетели

                        // Проверка на случай, если пока шла анимация, пользователь уже ускроллил от блока
                        if (!this.isVisible && !this.once) {
                            this.prepareCharsForAnimation();
                        }
                    }).catch(() => {
                        // Если анимация была прервана принудительно (например, переключили язык посреди анимации)
                        this.isAnimating = false;
                    });
                } else {
                    this.isAnimating = false;
                }
            });
    }

    private prepareCharsForAnimation(): void {
        const chars = this.splitType?.chars as HTMLElement[];
        if (!chars) return;
        chars.forEach(char => {
            this.renderer.setStyle(char, 'display', 'inline-block');
            this.renderer.setStyle(char, 'opacity', '0');
            this.renderer.setStyle(char, 'will-change', 'transform, opacity');
        });
    }

    private showStaticChars(): void {
        const chars = this.splitType?.chars as HTMLElement[];
        if (!chars) return;
        chars.forEach(char => {
            this.renderer.setStyle(char, 'display', 'inline-block');
            this.renderer.setStyle(char, 'opacity', '1');
            this.renderer.setStyle(char, 'transform', 'none');
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
