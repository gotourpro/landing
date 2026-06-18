import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, OnDestroy, OnInit, signal, ViewChild } from "@angular/core";
import { OrderService } from "../orders/services/orders.service";
import { BehaviorSubject, catchError, debounceTime, delay, filter, map, of, Subject, switchMap, take, takeUntil, tap } from "rxjs";
import { DialogModule } from 'primeng/dialog';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ChipModule } from 'primeng/chip';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
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
import { GoogleMapsModule } from '@angular/google-maps';
import { MapDrawingComponent } from "../maps/components/map-drawing/map-drawing-control.component";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BoundariesService } from "../../services/boundaries.service";
import { DeckDirective } from "../maps/deck/directives/deck.directive";
import { ArcLayerDirective } from "../maps/deck/directives/arc-layer.directive";
import { RouterModule } from "@angular/router";
import { ClusterLayerDirective } from "../maps/deck/directives/cluster-layer.directive";
import { ClusterCountLayerDirective } from "../maps/deck/directives/cluster-count-layer.directive";
import { ClusterSourceDirective } from "../maps/deck/directives/cluster-source.directive";
import { MapDataLayer } from "../maps/directives/map-data-layer.directive";
import { GoogleMapsLoaderService } from "../../services/google-maps-loader.service";
import { MapsStyleSettingsComponent } from "../maps/components/maps-style-settings/maps-style-settings.component";
import { GoogleMapsConfigService } from "../../services/google-maps-config.service";
import { featureCollection, feature } from "@turf/helpers";
import { FeatureCollection, Geometry } from "geojson";
@Component({
  selector: 'app-map-district-dialog',
  templateUrl: './map-district-dialog.component.html',
  styleUrls: ['./map-district-dialog.component.scss'],
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
    DistancePipe,
    DurationMinutesPipe,
    SkeletonModule,
    CheckImagePipe,
    ScrollPanelModule,
    TimerComponent,
    AverageSpeedPipe,
    ToggleSwitch,
    ButtonModule,
    TooltipModule,
    AutoCompleteModule,
    DeckDirective,
    ArcLayerDirective,
    ClusterCountLayerDirective,
    ClusterSourceDirective,
    ClusterLayerDirective,
    MapDataLayer,
    MapsStyleSettingsComponent
  ],
  providers: [OrderService, DatePipe, BoundariesService, MapService, DurationInSecondsPipe, TimeDifferencePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapDistrictDialogComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('drawing') drawingControl!: MapDrawingComponent;

  public boundariesSearch$ = new Subject<string>();
  public boundariesSuggestions$ = new BehaviorSubject<any[]>([]);

  public featureCollection: GeoJSON.FeatureCollection | null = null;

  public mapOptions: google.maps.MapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 3,
    disableDefaultUI: true,
    minZoom: 3,
    styles: [],
    restriction: { strictBounds: false, latLngBounds: { north: 83.8, south: -83.8, west: -180, east: 180 } },
    clickableIcons: false
  };

  public form: FormGroup;
  public noProgress: boolean = true;
  public inProgress: boolean;
  public isApiLoaded = false;
  public isVisibleSettings: boolean = false;
  public isVisibleStatictics: boolean = false;
  public isVisibleRoute = false;
  public fullscreenClass = 'c-map-dialog_wrapper';
  public itemData: any;
  public isLargeScreen: boolean;
  private _isMapSidebar = signal(true);
  private _map: any;

  public style$ = this._googleMapsConfigService.styleChanged$;
  private _destroy$ = new Subject<boolean>();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder,
    private dialogConfig: DynamicDialogConfig,
    private _dialogRef: DynamicDialogRef<MapDistrictDialogComponent>,
    public layoutService: LayoutService,
    public datePipe: DatePipe,
    private breakpointObserver: BreakpointObserver,
    private _boundariesService: BoundariesService,
    private _googleMapsLoader: GoogleMapsLoaderService,
    private _googleMapsConfigService: GoogleMapsConfigService,
  ) {
    this._buildForm();
  }

  public ngAfterViewInit(): void {
    this.patchFormValue(this.dialogConfig.data);
    this.itemData = this.dialogConfig.data;
  }

  public ngOnInit(): void {
    this._watchForMapAPILoadChanges();
    this._watchForBreakpointChanges();
    this._watchForBoundariesSearchChanges();
    this._watchForBoundariesValueChanges();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this._map = null;
    this.onClose();
  }


  public patchFormValue(data: any): void {
    const { geometry, bbox, center, name, title, description } = data || {};
    this.form.patchValue({ bbox, center, name, title, description, geometry });
    this.drawingControl?.onRemove();
    this.featureCollection = geometry ? featureCollection([
      feature(geometry)
    ]) : null;
    this._cdr.detectChanges();
  }

  public extractGeometry(collection: FeatureCollection): Geometry {
    if (!collection?.features?.length) {
      throw new Error('FeatureCollection is empty or invalid');
    }

    return collection.features[0].geometry;
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
        this.isLargeScreen = state.matches;
      });
  }

  private _watchForBoundariesValueChanges(): void {
    this.form.get('search')!.valueChanges
      .pipe(
        filter(value => value === null),
        tap(() => this.drawingControl?.onRemove()),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  private _watchForBoundariesSearchChanges(): void {
    const types = 'municipal_district,region,subregion,county,municipality,joint_submunicipality,joint_municipality';
    this.boundariesSearch$
      .pipe(
        debounceTime(300),
        switchMap(query => this._boundariesService.autocomplete(query, undefined, undefined, types)),
        catchError(() => of([])),
        tap((data) => this.boundariesSuggestions$.next(data)),
        takeUntil(this._destroy$)
      ).subscribe();
  }


  public onMapReady(map: any) { }

  public toggleSideBar(): void {
    this._isMapSidebar.update(current => !current);
    of(this._map)
      .pipe(
        filter(Boolean),
        delay(100),
        takeUntil(this._destroy$),
        tap((map) => map.resize())
      )
      .subscribe();
  }

  public onSearchBoundaries({ query }): void {
    this.boundariesSearch$.next(query);
  }

  public onSelectBoundaries(): void {
    const selectedPlace = this.form.value['search'];
    if (!selectedPlace || !selectedPlace.placeId) {
      console.error('Place not selected or placeId is missing.');
      return;
    }

    this._boundariesService.getBoundaryDetails(selectedPlace.placeId).pipe(
      filter(Boolean),
      map(data => {
        const feature = { ...data.features[0], name: data.features[0]?.text };
        return feature;
      }),
      tap(feature => {
        this.patchFormValue(feature);
        this.itemData = feature;
      }),
      takeUntil(this._destroy$)
    ).subscribe();
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

  public onClose() {
    this.drawingControl.getGeoJson$()
      .pipe(
        take(1),
        takeUntil(this._destroy$),
        tap((geoJson) => this._dialogRef.close({ ...this.form.value, geometry: geoJson?.features[0]?.geometry }))
      )
      .subscribe();
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      search: new FormControl(null),
      fitBounds: new FormControl(true),
      geometry: new FormControl(null),
      name: new FormControl(null),
      title: new FormControl(null),
      description: new FormControl(null),
      center: new FormControl(null),
      bbox: new FormControl(null),
      tolerance: new FormControl(0.01),
    });
  }

}