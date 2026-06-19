import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { StorageService } from './services/storage.service';
import { HttpClientService } from './services/http-client.service';
import { LoadPreloaderService } from './services/load-preloader.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PageLayout } from './components/layout/enums/page-layout.enum';
import { PageLayoutService } from './components/layout/services/page-layout.service';
import { AuthorizedLayoutComponent } from './components/layout/components/authorized-layout/component/authorized-layout.component';
import { ToolbarActionsService } from './services/toolbar-actions.service';
import { ToolbarSearchService } from './services/toolbar-search.service';
import { LayoutService } from './services/layout.service';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { PrimeNG } from 'primeng/config';
import { LoadProgressService } from './services/load-progress.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { LastVisitedPageService } from './services/last-visited-page.service';
import { PublicLayoutComponent } from './components/layout/components/public-layout/public.layout.component';
import { ToolbarButtonsService } from './services/toolbar-buttons.service';
import { NewsComponent } from './components/news/news.component';
import { GoogleMapsLoaderService } from './services/google-maps-loader.service';
import { AnimatedContainer } from './components/animatedcontainer';
import { SocialMenuComponent } from './components/social-menu/social-menu.component';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ToastModule,
    RouterOutlet,
    ConfirmDialog,
    ButtonModule,
    AuthorizedLayoutComponent,
    PublicLayoutComponent,
    NewsComponent,
    AnimatedContainer,
    SocialMenuComponent
  ],

  providers: [StorageService, HttpClientService, ConfirmationService, LoadPreloaderService, MessageService],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {

  readonly PageLayout = PageLayout;
  public isLoading$ = new BehaviorSubject<boolean>(true);

  public destroy$ = new Subject<boolean>();

  public overlayMenuOpenSubscription: Subscription;
  public menuOutsideClickListener: any;

  public menuScrollListener: any;

  public model: any[] = [];
  public timeout: any = null;

  constructor(
    public pageLayoutService: PageLayoutService,
    private _toolbarActionsService: ToolbarActionsService,
    private _toolbarSearchService: ToolbarSearchService,
    private _toolbarButtonsService: ToolbarButtonsService,
    private _loadProgressService: LoadProgressService,
    public layoutService: LayoutService,
    private router: Router,
    private config: PrimeNG,
    public renderer: Renderer2,
    private _lastVisitedPageService: LastVisitedPageService,
    private _googleMapsLoader: GoogleMapsLoaderService,
  ) {
    this._watchForRoute();
    this.config.setTranslation({
      dateFormat: 'dd-mm-yy',
    });

    this._googleMapsLoader.apiLoaded$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
      });
  }

  public ngOnInit(): void {
    this._googleMapsLoader.loadGoogleMapsScript();
    //localStorage.clear();
  }

  public ngOnDestroy(): void { }

  public onActivateRouterOutlet() {
    this._toolbarActionsService.actions$.next([]);
    this._toolbarSearchService.reset();
    this._toolbarButtonsService.actions$.next([]);
  }

  public isNewsActive = computed(() => this.layoutService.newsActive());

  private _watchForRoute(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading$.next(true);
        if (this._loadProgressService.inProgress) {
          this._loadProgressService.hide(9999);
        }
      } else if (event instanceof NavigationEnd) {
        this._lastVisitedPageService.setLastVisitedUrl(event.urlAfterRedirects);
        this.isLoading$.next(false);
      } else if (event instanceof NavigationCancel) {
        this.isLoading$.next(false);
      } else if (event instanceof NavigationError) {
        this.isLoading$.next(false);
      }
    });
  }

  public get containerClass(): any {
    return {
      'layout-light': !this.layoutService.config().darkTheme,
      'layout-dark': this.layoutService.config().darkTheme,
      'layout-colorscheme-menu':
        this.layoutService.config().menuTheme === 'colorScheme',
      'layout-primarycolor-menu':
        this.layoutService.config().menuTheme === 'primaryColor',
      'layout-transparent-menu':
        this.layoutService.config().menuTheme === 'transparent',
      'layout-overlay':
        this.layoutService.config().menuMode === 'overlay',
      'layout-static': this.layoutService.config().menuMode === 'static',
      'layout-slim': this.layoutService.config().menuMode === 'slim',
      'layout-slim-plus':
        this.layoutService.config().menuMode === 'slim-plus',
      'layout-horizontal':
        this.layoutService.config().menuMode === 'horizontal',
      'layout-reveal': this.layoutService.config().menuMode === 'reveal',
      'layout-drawer': this.layoutService.config().menuMode === 'drawer',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config().menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active':
        this.layoutService.state.staticMenuMobileActive,
      'layout-sidebar-active': this.layoutService.state.sidebarActive,
      'layout-sidebar-anchored': this.layoutService.state.anchored,
      'layout-map-overlay-active': this.layoutService.isMapSidebar(),
      'layout-news-active': this.isNewsActive()
    };
  }


}
