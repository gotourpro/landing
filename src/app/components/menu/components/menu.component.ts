import { afterNextRender, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Router, RouterModule } from '@angular/router';
import { catchError, debounceTime, filter, fromEvent, of, startWith, Subject, take, takeUntil } from 'rxjs';
import { FormGroup, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { RouterLink } from "@angular/router";
import { MenubarModule } from 'primeng/menubar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { twMerge } from 'tailwind-merge';
import { MenubarMobileComponent } from '../../menubar-mobile/menubar-mobile.component';
import { LanguageControlComponent } from '../../language-control/language-control.component';
import { KeepOpenMegaMenuDirective } from '../directives/keep-menu.directive';
import { MegaMenuMaskDirective } from '../directives/mask-menu.directive';
import { ConfiguratorComponent } from '../../configurator/configurator.component';
import { DialogDrawerService } from '../../dialog-panel/dialog-panel.service';
import { DIALOG_PANEL_DATA } from '../../dialog-panel/dialog-panel.tokens';
import { MenuService } from '../services/menu.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Menubar,
        SelectModule,
        ButtonModule,
        RouterModule,
        AvatarModule,
        MenubarMobileComponent,
        LanguageControlComponent,
        KeepOpenMegaMenuDirective,
        MegaMenuMaskDirective,
        TranslateModule,
        RouterLink,
        MenubarModule,
        ConfiguratorComponent
    ],
    providers: [
        DialogDrawerService,
        {
            provide: DIALOG_PANEL_DATA,
            useValue: {},
        }],
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('megaContainer', { static: true, read: ElementRef })
    megaContainer!: ElementRef<HTMLElement>;

    @ViewChild('indicator', { static: true, read: ElementRef })
    indicator!: ElementRef<HTMLDivElement>;
    isSticky = false;
    @ViewChildren('menuLink', { read: ElementRef })
    links!: QueryList<ElementRef<HTMLAnchorElement>>;

    @ViewChild('stickyWrapper', { static: true, read: ElementRef })
    stickyWrapper!: ElementRef<HTMLElement>;

    @Input() containerStyleClass: string = '';
    @Input() sybContainerStyleClass: string = '';
    @Input() styleClass: string = '';
    @Input() logoStyleClass: string = 'fill-primary dark:fill-primary';
    @Input() logoTextStyleClass: string = 'fill-[#505A7C] dark:fill-[#505A7C]';
    @Input() styleClassColor: string = '';
    @Input() styleClassEnd: string = 'text-primary dark:text-white';

    @HostListener('window:scroll', ['$event'])
    public onWindowScroll() {
        this.isSticky = window.scrollY > 70;
        if (this.isSticky) {
            this.styleClassColor = "'text-black dark:text-white!'"
        }
    }
    public twMerge = twMerge;
    private window: Window;
    public scrollListener: VoidFunction | null;
    public form: FormGroup;
    public isMobile = false;
    public refMobile: any = null;
    public menuItems: MenuItem[] = [];
    public breakpoint = '1230px';
    private destroy$ = new Subject<void>();
    constructor(
        private renderer: Renderer2,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef,
        private menuService: MenuService,
        private router: Router,
        private _dialogDrawerService: DialogDrawerService,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object,
        private breakpointObserver: BreakpointObserver,
        private el: ElementRef,
        private translate: TranslateService
    ) {
        const mq = `(max-width: ${this.breakpoint})`;

        this.window = this.document.defaultView as Window;
        afterNextRender(() => {
            this.bindScrollListener();
        });

        this.breakpointObserver
            .observe([mq])
            .pipe(takeUntil(this.destroy$))
            .subscribe(state => {
                this.isMobile = state.matches;
            });
    }

    public ngOnInit() {
        this._initMenu();
        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this._initMenu());
    }

    public openMobileMenu(): void {
        this.refMobile = this._dialogDrawerService.open(MenubarMobileComponent, {
            data: {},
            hasBackdrop: false,
            backdropClass: '',
            panelClass: ''
        });
        this.refMobile.afterClosed
            .pipe()
            .subscribe();
    }

    private _initMenu(): void {
        this.translate.get([
            'components.topMenu.about',
            'components.topMenu.destination',
            'components.topMenu.tour',
            'components.topMenu.blog',
            'components.topMenu.faq',
            'components.topMenu.contact'
        ]).subscribe(translations => {
            this.menuItems = [
                { label: translations['components.topMenu.about'], route: '/about' },
                { label: translations['components.topMenu.destination'], route: '/destinations' },
                { label: translations['components.topMenu.tour'], route: '/tours' },
                { label: translations['components.topMenu.blog'], route: '/blog' },
                { label: translations['components.topMenu.faq'], route: '/faq' },
                { label: translations['components.topMenu.contact'], route: '/contact' },
            ];

            this.menuService.setMenu(this.menuItems);
        });
    }

    public ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }


        this.ngZone.runOutsideAngular(() => {
            this.links.changes
                .pipe(startWith(this.links), takeUntil(this.destroy$))
                .subscribe(() => this.moveToActive());

            fromEvent(window, 'resize')
                .pipe(startWith(null), debounceTime(50), takeUntil(this.destroy$))
                .subscribe(() => {
                    if (!this.isMobile) {
                        this.refMobile?.overlayRef?.close();
                        this.moveToActive();
                    }
                });
        });
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public bindScrollListener(): void {
        if (!this.scrollListener) {
            this.scrollListener = this.renderer.listen(this.window, 'scroll', () => {
                if (this.window.scrollY > 0) {
                    this.el.nativeElement.children[0].classList.add('layout-topbar-sticky');
                } else {
                    this.el.nativeElement.children[0].classList.remove('layout-topbar-sticky');
                }
            });
        }
    }


    public onContainerMouseMove(e: MouseEvent) {
        if (this.isMobile) return;
        const anchor = (e.target as HTMLElement).closest('a.root-menu-link') as HTMLElement | null;
        if (anchor) {
            this.setIndicator(anchor);
        }
    }

    public resetIndicator() {
        if (!this.isMobile) {
            this.moveToActive();
        }
    }

    public clearIndicator() {
        this.renderer.setStyle(
            this.indicator.nativeElement,
            'width',
            '0px'
        );
    }

    public onLinkActiveChange(isActive: any, linkRef: any) {
        if (isActive && !this.isMobile) {
            const el = linkRef.nativeElement as any;
            if (el.classList.contains('root-menu-link')) {
                this.setIndicator(el);
            }
        }
    }

    private moveToActive() {
        if (this.isMobile) return;

        const roots = this.links.toArray()
            .map(l => l.nativeElement)
            .filter(el => el.classList.contains('root-menu-link'));

        const activeRoot = roots.find(el =>
            el.classList.contains('active-menu-item')
        );

        if (activeRoot) {
            this.setIndicator(activeRoot);
            return;
        }

        const url = this.router.url;

        const parentIdx = this.menuItems.findIndex(mi =>
            mi.items?.some(child => child['route'] === url)
        );

        if (parentIdx >= 0 && roots[parentIdx]) {
            this.setIndicator(roots[parentIdx]);
            return;
        }
        this.hideIndicator();
    }

    private hideIndicator() {
        this.renderer.setStyle(
            this.indicator.nativeElement,
            'width',
            '0px'
        );
    }


    private setIndicator(el: HTMLElement) {
        const containerRect = this.megaContainer.nativeElement.getBoundingClientRect();
        const span = el.querySelector('span');
        const target = span instanceof HTMLElement ? span : el;
        const rect = target.getBoundingClientRect();

        const left = rect.left - containerRect.left;
        const width = rect.width;

        this.renderer.setStyle(this.indicator.nativeElement, 'width', `${width}px`);
        this.renderer.setStyle(
            this.indicator.nativeElement,
            'transform',
            `translateX(${left}px)`
        );
    }

}