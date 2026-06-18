import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, computed, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { Subject, filter } from 'rxjs';
import { LoadProgressService } from '../../../../services/load-progress.service';
import { MapComponent } from '../../../maps/map.component';
import { ToolbarSearchService } from '../../../../services/toolbar-search.service';
import { ToolbarButtonsService } from '../../../../services/toolbar-buttons.service';
import { ToolBarButtonsMenu } from '../../../../constants/buttons-toolbar.constant';
import { LayoutService } from '../../../../services/layout.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
    selector: 'map-layout',
    imports:
        [CommonModule,
            MapComponent,
            RouterModule,
            RouterOutlet, ProgressBarModule, RouterOutlet],
    providers: [],
    templateUrl: './map-layout.component.html',
    styleUrl: './map-layout.component.scss',
})
export class MapLayoutComponent implements AfterViewInit, OnInit, OnDestroy {

    public showProgress: boolean = false;
    public sidenavViewContent: string;
    public toolbarActions: any[];
    public excludedToolbarIds = ['filter', 'export', 'settings'];
    public isSmallScreen: boolean;

    public destroy$ = new Subject<boolean>();

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _cdr: ChangeDetectorRef,
        public layoutService: LayoutService,
        private _loadProgressService: LoadProgressService,
        private _toolbarSearchService: ToolbarSearchService,
        private _toolbarButtonsService: ToolbarButtonsService,
        private breakpointObserver: BreakpointObserver,

    ) {

        this.breakpointObserver
            .observe(['(max-width: 767px)'])
            .subscribe((state: BreakpointState) => {
                this.isSmallScreen = state.breakpoints['(max-width: 767px)'];
            });
        this._watchForRouteChanges();
        this._watchForLoadProgress();
    }

    private _watchForRouteChanges(): void {
        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd)
        ).subscribe((event) => {
            window.scrollTo(0, 0);
        });
    }

    private _watchForLoadProgress(): void {
        this._loadProgressService.inProgress
            .subscribe((progress: boolean) => {
                this.showProgress = progress;
            });
    }

    public ngOnInit(): void {
        this._toolbarSearchService.reset();
        this.toolbarActions = this.mapMenuItems(ToolBarButtonsMenu, true, this.excludedToolbarIds);
        this._initToolbarActions();
    }

    public ngAfterViewInit(): void { }

    public onActivateRouterOutlet(): void {
        this._toolbarSearchService.reset();
    }


    private _initToolbarActions(data?): void {
        const toolbar = this._buildToolbar(data);
        this._toolbarButtonsService.actions$.next(toolbar);
    }


    public toggleSideBar(): void {
        this.layoutService.toggleSideBar();
    }

    public isMapSidebar = computed(() => this.layoutService.isMapSidebar());

    private _buildToolbar(data): any {
        const { badge, name } = data || {};
        if (!badge && !name) return this.toolbarActions;
        return this.toolbarActions = this.toolbarActions?.map((data) => ({ ...data, badge: data.name === name ? badge : data.badge }));
    }

    public onShowMap() {
        this.layoutService.toggleSideBar();
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this._toolbarButtonsService.actions$.next([]);
    }

    private mapMenuItems(items: any[], addPointEvent: boolean = false, excludedIds: string[] = []): any[] {
        return items
            .filter(item => !excludedIds.includes(item.id))
            .map(item => ({
                ...item,
                command: (event: any) => {
                    item.command && item.command({
                        ...event,
                        context: this,
                        ...(addPointEvent ? { pointEvent: event } : {})
                    });
                }
            }));
    }
}
