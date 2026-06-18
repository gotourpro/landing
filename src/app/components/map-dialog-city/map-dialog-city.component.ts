import { CommonModule, NgFor, NgIf } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, OnDestroy, OnInit, signal, ViewChild } from "@angular/core";
import { OrderService } from "../orders/services/orders.service";
import { BehaviorSubject, combineLatest, debounceTime, delay, distinctUntilChanged, filter, map, Observable, Subject, switchMap, takeUntil, tap } from "rxjs";
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ChipModule } from 'primeng/chip';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MapZoomControlComponent } from "../maps/components/map-zoom-control/map-zoom-control.component";
import { MapFullscreenComponent } from "../maps/components/map-fullscreen/map-fullscreen.component";
import { MapService } from "../maps/services/map-service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { SpeedDialModule } from "primeng/speeddial";
import { ProgressBarModule } from "primeng/progressbar";
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DistancePipe } from "../../pipes/distance.pipe";
import { SkeletonModule } from 'primeng/skeleton';
import { LayoutService } from "../../services/layout.service";
import { CheckImagePipe } from "../../pipes/check-image.pipe";
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TimeDifferencePipe } from "../../pipes/time-difference.pipe";
import { TimerComponent } from "../timer/timer.component";
import { DurationInSecondsPipe } from "../../pipes/duration-to-dates.pipe";
import { DurationMinutesPipe } from "../../pipes/duration-minutes.pipe";
import { AverageSpeedPipe } from "../../pipes/average-speed.pipe";
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { TooltipModule } from "primeng/tooltip";
import { deepEquals } from "@primeuix/utils";
import { GoogleMapsModule } from '@angular/google-maps';
import { MapDrawingComponent } from "../maps/components/map-drawing/map-drawing-control.component";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BoundariesService } from "../../services/boundaries.service";
import { RouterModule } from "@angular/router";
import { MapDataLayer } from "../maps/directives/map-data-layer.directive";
import { DistrictsService } from "../logistics/districts/services/districts.service";
import { GoogleMapsLoaderService } from "../../services/google-maps-loader.service";
import { GoogleMapsConfigService } from "../../services/google-maps-config.service";
import { MapsStyleSettingsComponent } from "../maps/components/maps-style-settings/maps-style-settings.component";
import { DataView } from 'primeng/dataview';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollerOptions } from "primeng/api";
import { featureCollection, polygon, multiPolygon } from '@turf/helpers';
import { FeatureCollection } from "geojson";
@Component({
  selector: 'app-map-dialog-city',
  templateUrl: './map-dialog-city.component.html',
  styleUrls: ['./map-dialog-city.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GoogleMapsModule,
    DrawerModule,
    DialogModule,
    ChipModule,
    ReactiveFormsModule,
    MapZoomControlComponent,
    MapFullscreenComponent,
    MapDrawingComponent,
    SpeedDialModule,
    ProgressBarModule,
    RippleModule,
    SliderModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    SkeletonModule,
    ScrollPanelModule,
    ToggleSwitch,
    ButtonModule,
    TooltipModule,
    MapDataLayer,
    ScrollerModule,
    MapsStyleSettingsComponent
  ],
  providers: [OrderService, DatePipe, BoundariesService, DistrictsService, MapService, DurationInSecondsPipe, TimeDifferencePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapDialogCityComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('drawing') drawingControl!: MapDrawingComponent;
  @ViewChild('virtualScroller') virtualScroller!: any;
  @ViewChild('dataLayer', { read: MapDataLayer }) dataLayer!: MapDataLayer;

  public mapOptions: google.maps.MapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 3,
    disableDefaultUI: true,
    minZoom: 3,
    styles: [],
    restriction: { strictBounds: false, latLngBounds: { north: 83.8, south: -83.8, west: -180, east: 180 } },
    clickableIcons: false
  };

  public dataSource: any[] = [];
  public itemData: any;
  public geometry: any;
  public geoJson: any
  public fitBounds = true;
  public id: string;
  public noProgress: boolean;
  public inProgress = true;
  public page = 0;
  public limit = 0
  public isApiLoaded = false;
  public isMapLoad = false;
  public isVisibleSettings: boolean = false;
  public isVisibleDetail: boolean = false;
  public fullscreenClass = 'c-map-dialog_wrapper';
  public form: FormGroup;
  public isSmallScreen: boolean;
  private _isMapSidebar = signal(true);
  private _map: any;
  public scrollerOptions: ScrollerOptions;
  public first = 0;
  public rows = 10;
  private _hasFetchedInitially = false
  public style$ = this._googleMapsConfigService.styleChanged$;
  private _bbox$ = new BehaviorSubject<number[] | null>(null);
  private readonly _suppressBoundsFetch$ = new BehaviorSubject<boolean>(false);
  private _destroy$ = new Subject<boolean>();
  private _getDataSource$ = new Subject<any>();

  private shouldFetch$!: Observable<number[]>;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder,
    private dialogConfig: DynamicDialogConfig,
    private _dialogRef: DynamicDialogRef<MapDialogCityComponent>,
    public layoutService: LayoutService,
    public datePipe: DatePipe,
    private breakpointObserver: BreakpointObserver,
    private _districtService: DistrictsService,
    private _googleMapsLoader: GoogleMapsLoaderService,
    private _googleMapsConfigService: GoogleMapsConfigService,
  ) {

    this.dataSource = Array.from({ length: 5 });

    this.noProgress = true;
    this._buildForm();

    this.scrollerOptions = {
      showLoader: true,
      numToleratedItems: 3,
      autoSize: false,
      scrollHeight: undefined,
      lazy: true,
      itemSize: 200,
      delay: 100,
      resizeDelay: 100,
    }


  }


  public fitToFeatureById(id: string): void {
    this.dataLayer?.fitToFeatureById(id);
  }

  private _listenGetDataSource(): void {
    this._getDataSource$
      .pipe(
        map(({ _force, ...body }) => body),
        switchMap((body) => this._districtService.findByCityAndBboxPaginated(body)),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  public ondataLayerClick({ feature }: any): void {
    this.isVisibleDetail = false;
    this.dataLayer.resetFeatureStyles();
    this.onDetail(feature?.getId());
  }

  public ngAfterViewInit(): void {
    const { id } = this.dialogConfig.data || {};
    this.id = id;
  }

  public ngOnInit(): void {
    this._initShouldFetch$();
    this._watchForBoundsChanges();
    this._listenGetDataSource();
    this._listenDataSource();
    this._watchForMapAPILoadChanges();
    this._watchForBreakpointChanges();
  }


  private _initShouldFetch$(): void {
    this.shouldFetch$ = combineLatest([
      this._suppressBoundsFetch$,
      this._bbox$,
    ]).pipe(
      debounceTime(600),
      distinctUntilChanged(([, a], [, b]) => deepEquals(a, b)),
      filter((entry): entry is [boolean, number[]] =>
        Array.isArray(entry[1]) && entry[1].length === 4
      ),
      filter(([suppress]) => !suppress),
      filter(([_, bbox]) => {
        const allowInitialFetch =
          !this._hasFetchedInitially &&
          this.isMapSidebar() &&
          this.isSmallScreen;

        const allowNormalFetch =
          (!this.isMapSidebar() && this.isSmallScreen) ||
          !this.isSmallScreen;

        if (allowInitialFetch) {
          this._hasFetchedInitially = true;
          return true;
        }

        return allowNormalFetch;
      }),
      map(([_, bbox]) => bbox)
    );
  }


  public onLazyLoad(event: any): void {
    const bbox = this._bbox$.getValue();
    if (!bbox || bbox.length !== 4) return;
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;

    this.page = Math.floor(this.first / this.rows) + 1;
    this.limit = this.rows;

    this._getDataSourceList();
    this._cdr.detectChanges();
  }


  private _getDataSourceListQuery(): any {
    return {
      cityId: this.id,
      bbox: this._bbox$.getValue(),
      page: this.page,
      limit: this.limit,
    };
  }

  private _getDataSourceList(_force = false): void {
    this.inProgress = true;
    this._cdr.detectChanges();
    const body = this._getDataSourceListQuery();
    this._getDataSource$.next({ ...body, _force });
  }

  private _listenDataSource(): void {
    this._districtService.findByCityAndBboxPaginated$
      .pipe(
        filter(Boolean),
        map(data => ({
          ...data,
          items: (data.items ?? []).map(item => this.transformItem(item))
        })),
        tap(data => {
          const features = data.items
            .filter(i => i.geometry?.type === 'Polygon' || i.geometry?.type === 'MultiPolygon')
            .map(i => {
              const { geometry, ...properties } = i;
              return geometry.type === 'Polygon'
                ? polygon(geometry.coordinates, properties)
                : multiPolygon(geometry.coordinates, properties);
            });

          this.geoJson = this.assignFeatureIdsFromProperties(featureCollection(features));
        }),
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: (data: any) => {
          this._fillDataSource(data);
        },
        error: (err: any) => {
          this.inProgress = false;
          this._cdr.detectChanges();
        }
      });
  }


  public assignFeatureIdsFromProperties(fc: FeatureCollection): FeatureCollection {
    fc.features.forEach((f, i) => {
      if (!f.id && f.properties?.['id']) {
        f.id = f.properties?.['id'];
      }
    });
    return fc;
  }

  private _fillDataSource(response: any): void {
    const { meta, items } = response;
    this.inProgress = false;
    this._cdr.detectChanges();
    if (!items || !meta?.totalItems) {
      this.dataSource = [];
      this._cdr.detectChanges();
      return;
    }

    this.dataSource = items;
    this.fitBounds = false;
    this._cdr.detectChanges();
  }


  public trackByFn(index: number, item: any): any {
    return item?.id ?? index;
  }

  private transformItem(item: any): any {
    return {
      ...item,
    };
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this._map = null;
    this.onClose();
  }

  public onBoundsChanged(event) {
    const bounds = this._map.getBounds();
    if (!bounds) return;

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const bbox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];

    this._bbox$.next(bbox);
  }

  public onMapReady(map: any): void {
    this._map = map;
  }

  private _watchForBoundsChanges() {
    this.shouldFetch$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.page = 1;
        this.limit = this.rows;
        this._getDataSourceList();
        this._cdr.detectChanges();
      });
  }

  private _watchForMapAPILoadChanges(): void {
    this._googleMapsLoader.load$()
      .pipe(
        delay(100)
      )
      .subscribe(() => {
        this.isApiLoaded = true;
        this.noProgress = false;
        this._cdr.detectChanges();
      });
  }

  private _watchForBreakpointChanges(): void {
    this.breakpointObserver
      .observe(['(max-width: 992px)'])
      .subscribe((state: BreakpointState) => {
        this.isSmallScreen = state.matches;
        console.log(this.isSmallScreen, 'this.isLargeScreen', this.isMapSidebar())
      });
  }


  public toggleSideBar(): void {
    this._isMapSidebar.update(current => !current);
  }

  public isMapSidebar = computed(() => this._isMapSidebar());

  public containerClass = computed(() => {
    return {
      'sidebar-active': this.isMapSidebar(),
    };
  });

  public onSettings(): void {
    this.isVisibleSettings = !this.isVisibleSettings;
  }

  public onDetail(id: string): void {
    this.isVisibleDetail = !this.isVisibleDetail;
    this.dataLayer.fitToFeatureById(id);
    this.itemData = this.dataLayer.getFeatureByIdProperties(id);
    this.dataLayer.highlightFeatureById(id);
    this._suppressBoundsFetch$.next(true);
    this._cdr.detectChanges();
  }

  public onDetailClose(): void {
    this.dataLayer.resetFeatureStyles();
    this._suppressBoundsFetch$.next(false);
  }

  public onRender(event: any): void {
    event.target.resize();
  }

  public onClose(): void {
    this._dialogRef.close({ ...this.form.value, geometry: this.geometry });
  }

  private _buildForm(): void {
    this.form = this._fb.group({

    });
  }

}