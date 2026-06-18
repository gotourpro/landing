import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Directive, ElementRef, Host, Inject, OnDestroy, Optional, PLATFORM_ID, Renderer2 } from "@angular/core";
import { Menubar } from "primeng/menubar";
import { fromEvent, fromEventPattern, Subscription } from "rxjs";
import { addClass, blockBodyScroll, unblockBodyScroll } from '@primeuix/utils';

@Directive({
    selector: '[megaMenuMask]'
})
export class MegaMenuMaskDirective implements AfterViewInit, OnDestroy {
    private mask: HTMLElement | null = null;
    private container!: HTMLElement;
    private mutationSub?: Subscription;
    private clickSub?: Subscription;
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        @Optional() @Host() private menuBar: Menubar,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document
    ) { }

    public ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) { return; }
        unblockBodyScroll(undefined);
        const host: HTMLElement = this.el.nativeElement;
        this.container = host.querySelector('.p-menubar') ?? host;
        this.mutationSub = fromEventPattern<MutationRecord>(
            handler => {
                const observer = new MutationObserver(records => records.forEach(r => handler(r)));
                observer.observe(this.container, { attributes: true });
                return observer;
            },
            (_handler, observer: MutationObserver) => observer.disconnect()
        ).subscribe(mutation => {
            if (mutation.attributeName === 'class') {
                const active = this.container.classList.contains('p-menubar-mobile-active');
                active ? this.showMask() : this.hideMask();
            }
        });
    }

    private showMask(): void {
        if (!isPlatformBrowser(this.platformId) || this.mask) {
            return;
        }

        this.mask = this.renderer.createElement('div');
        this.renderer.addClass(this.mask, 'p-overlay-mask');
        this.renderer.addClass(this.mask, 'p-megamenu-mask');
        this.renderer.addClass(this.mask, 'p-overlay-mask-enter');
        this.renderer.setStyle(this.mask, 'z-index', '10');
        blockBodyScroll(undefined);

        this.clickSub = fromEvent(this.mask!, 'click').subscribe(() => {
            if (this.menuBar) {
                this.menuBar.mobileActive = false;
                this.menuBar.cd.markForCheck();
                this.hideMask()
            }
        });

        this.renderer.insertBefore(
            this.container,
            this.mask,
            this.container.firstChild
        );
    }

    private hideMask(): void {
        if (!isPlatformBrowser(this.platformId) || !this.mask) {
            return;
        }
        addClass(this.mask!, 'p-overlay-mask-leave');
        unblockBodyScroll(undefined);
        this.destroyMask();
    }

    private destroyMask(): void {
        if (!this.mask) {
            return;
        }

        this.clickSub?.unsubscribe();
        this.clickSub = undefined;

        unblockBodyScroll(undefined);
        this.renderer.removeChild(this.container, this.mask);
        this.mask = null;
    }

    public ngOnDestroy(): void {
        this.mutationSub?.unsubscribe();
        this.destroyMask();
    }
}

