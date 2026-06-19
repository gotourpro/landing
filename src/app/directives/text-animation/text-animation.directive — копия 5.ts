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
    private isAnimating = false;

    @Input('appTextAnimation') animation: TextAnimationType = 'fade';
    @Input() translationKey = '';
    @Input() delay = 0;
    @Input() stagger = 100; // Для слов stagger должен быть чуть больше (например, 70-100мс), чем для букв (20мс)
    @Input() duration = 1000; // Оригинальные тайминги обычно около 1000-1200мс
    @Input() once = true;
    @Input() intersectionMargin = '-50px 0px -50px 0px';
    @Input() threshold = 0.15;

    // НАСТРОЙКА КРАСОТЫ: 'lines' (строки), 'words' (целые слова), 'chars' (буквы)
    @Input() splitBy: 'lines' | 'words' | 'chars' = 'words';
    // ВКЛЮЧЕНИЕ МАСКИ: выплывание из невидимой области (по умолчанию true для красивого эффекта)
    @Input() useMask = true;

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
                    if (this.isAnimating) return;

                    if (!this.once || !this.hasAnimated) {
                        this.loadAndAnimate();
                    }

                    if (this.once) {
                        this.intersectionObserver?.disconnect();
                    }
                } else {
                    this.isVisible = false;
                    if (!this.once && this.hasAnimated && !this.isAnimating) {
                        this.prepareElementsForAnimation();
                    }
                }
            },
            { threshold: this.threshold, rootMargin: this.intersectionMargin }
        );
        this.intersectionObserver.observe(element);

        this.langChangeSub = this.translateService.onLangChange.subscribe(() => {
            this.skipNextAnimation = true;
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
        return !!((nav.deviceMemory && nav.deviceMemory < 4) || (nav.hardwareConcurrency && nav.hardwareConcurrency < 4));
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

                // Нарезаем текст в зависимости от выбранного splitBy режима
                this.splitType = new SplitType(element, { types: [this.splitBy] });

                if (this.skipNextAnimation) {
                    this.skipNextAnimation = false;
                    this.showStaticElements();
                    if (this.isVisible) {
                        element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
                    }
                    return;
                }

                this.hasAnimated = true;
                this.isAnimating = true;
                this.prepareElementsForAnimation();

                const keyframes = this.getKeyframes();
                const targets = this.getTargetElements();
                let lastAnimation: Animation | null = null;

                targets.forEach((target, index) => {
                    const calculatedDelay = this.delay + (index * this.stagger);
                    const anim = target.animate(keyframes, {
                        duration: this.duration,
                        delay: calculatedDelay,
                        fill: 'forwards',
                        easing: 'cubic-bezier(0.25, 1, 0.5, 1)' // Изменили кривую на более мягкую "outQuart"
                    });
                    this.activeAnimations.push(anim);

                    if (index === targets.length - 1) {
                        lastAnimation = anim;
                    }
                });

                if (lastAnimation) {
                    (lastAnimation as Animation).finished.then(() => {
                        this.isAnimating = false;
                        if (!this.isVisible && !this.once) {
                            this.prepareElementsForAnimation();
                        }
                    }).catch(() => {
                        this.isAnimating = false;
                    });
                } else {
                    this.isAnimating = false;
                }
            });
    }

    /**
     * Получает массив элементов для анимации в зависимости от настроек
     */
    private getTargetElements(): HTMLElement[] {
        if (!this.splitType) return [];
        if (this.splitBy === 'lines') return (this.splitType.lines || []) as HTMLElement[];
        if (this.splitBy === 'chars') return (this.splitType.chars || []) as HTMLElement[];
        return (this.splitType.words || []) as HTMLElement[]; // по умолчанию words
    }

    private prepareElementsForAnimation(): void {
        const targets = this.getTargetElements();
        targets.forEach(target => {
            this.renderer.setStyle(target, 'display', 'inline-block');
            this.renderer.setStyle(target, 'opacity', '0');
            this.renderer.setStyle(target, 'will-change', 'transform, opacity');

            // ИСПРАВЛЕНИЕ: Если включен режим маски, сохраняем блочную структуру и пробелы
            if (this.useMask && target.parentElement) {
                this.renderer.setStyle(target.parentElement, 'overflow', 'hidden');

                // Если мы анимируем строки — маска должна быть block, чтобы они были друг под другом
                if (this.splitBy === 'lines') {
                    this.renderer.setStyle(target.parentElement, 'display', 'block');
                } else {
                    // Если слова/буквы — используем inline-flex, он сохраняет центрирование и не ломает пробелы
                    this.renderer.setStyle(target.parentElement, 'display', 'inline-flex');
                }
            }
        });
    }

    private showStaticElements(): void {
        const targets = this.getTargetElements();
        targets.forEach(target => {
            this.renderer.setStyle(target, 'display', 'inline-block');
            this.renderer.setStyle(target, 'opacity', '1');
            this.renderer.setStyle(target, 'transform', 'none');

            // Убираем маску при статичном показе (смене языка)
            if (target.parentElement) {
                this.renderer.removeStyle(target.parentElement, 'overflow');
                this.renderer.removeStyle(target.parentElement, 'display');
            }
        });
    }


    private cleanupAnimations(): void {
        this.activeAnimations.forEach(anim => anim.cancel());
        this.activeAnimations = [];
    }

    private getKeyframes(): Keyframe[] {
        // Изменили начальные точки сдвигов, чтобы анимация в маске выглядела аккуратно (100% высоты для выплывания снизу)
        switch (this.animation) {
            case 'left': return [{ transform: 'translateX(-40px)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }];
            case 'right': return [{ transform: 'translateX(40px)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }];
            case 'up': return [{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }];
            case 'down': return [{ transform: 'translateY(-100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }];
            case 'rotate': return [{ transform: 'rotateX(60deg)', opacity: 0 }, { transform: 'rotateX(0deg)', opacity: 1 }];
            case 'scale': return [{ transform: 'scale(0.8)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }];
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
