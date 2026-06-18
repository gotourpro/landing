import { CommonModule, NgFor, NgIf } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, OnDestroy, OnInit, signal } from "@angular/core";
import { OrderService } from "../orders/services/orders.service";
import { BehaviorSubject, delay, filter, map, of, Subject, takeUntil, tap } from "rxjs";
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ChipModule } from 'primeng/chip';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MapZoomControlComponent } from "../maps/components/map-zoom-control/map-zoom-control.component";
import { MapFullscreenComponent } from "../maps/components/map-fullscreen/map-fullscreen.component";
// import { MapService } from "../maps/services/map-service";
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
import { ArcLayerProps } from "@deck.gl/layers";
import { DeckDirective } from "../maps/deck/directives/deck.directive";
import { ArcLayerDirective } from "../maps/deck/directives/arc-layer.directive";
import { RouterModule } from "@angular/router";
import { ClusterLayerDirective } from "../maps/deck/directives/cluster-layer.directive";
import { ClusterCountLayerDirective } from "../maps/deck/directives/cluster-count-layer.directive";
import { ClusterSourceDirective } from "../maps/deck/directives/cluster-source.directive";
import { MapDataLayer } from "../maps/directives/map-data-layer.directive";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
// import { CountryService } from "../logistics/country/services/country.service";
import { HttpClient } from "@angular/common/http";
import { GoogleMapsLoaderService } from "../../services/google-maps-loader.service";
import { GoogleMapsConfigService } from "../../services/google-maps-config.service";
import { MapsStyleSettingsComponent } from "../maps/components/maps-style-settings/maps-style-settings.component";
@Component({
  selector: 'app-map-country-dialog',
  templateUrl: './map-country-dialog.component.html',
  styleUrls: ['./map-country-dialog.component.scss'],
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
    MapDataLayer,
    MapsStyleSettingsComponent
  ],
  providers: [OrderService, DatePipe, BoundariesService, DurationInSecondsPipe, TimeDifferencePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapCountryDialogComponent implements AfterViewInit, OnInit, OnDestroy {

  public mapOptions: google.maps.MapOptions = {
    center: { lat: 54.5260, lng: 15.2551 },
    zoom: 3,
    disableDefaultUI: true,
    minZoom: 3,
    styles: [],
    restriction: { strictBounds: false, latLngBounds: { north: 83.8, south: -83.8, west: -180, east: 180 } },
    clickableIcons: false
  };

  public id: string;
  public geometry: any;
  public isApiLoaded = false;
  public noProgress: boolean;
  public inProgress: boolean;
  public isMapLoad = false;
  public isVisibleSettings: boolean = false;
  public isVisibleStatictics: boolean = false;
  public isVisibleRoute = false;
  public position: string = 'bottom';
  public fullscreenClass = 'c-map-dialog_wrapper';
  public form: FormGroup;
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
    private _dialogRef: DynamicDialogRef<MapCountryDialogComponent>,
    public layoutService: LayoutService,
    public datePipe: DatePipe,
    // private _countryService: CountryService,
    private breakpointObserver: BreakpointObserver,
    private _googleMapsLoader: GoogleMapsLoaderService,
    private _googleMapsConfigService: GoogleMapsConfigService,
    private _http: HttpClient,
  ) {
    this.noProgress = true;
    this._buildForm();
  }

  public geoJson: FeatureCollection<Geometry, GeoJsonProperties>;
  

  public ngAfterViewInit(): void {
    const { id } = this.dialogConfig.data || {};
    this.id = id;
    this._getDataById();
    this._cdr.detectChanges();
  }

  public ngOnInit(): void {
    this._watchForMapAPILoadChanges();
    this._watchForBreakpointChanges();
   }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this._map = null;
    this.onClose();
  }

  private _getDataById(): void {
    // this._countryService.getById(this.id)
    //   .pipe(
    //     delay(300),
    //     filter(Boolean),
    //     tap((data) => this._buildData(data)),
    //     tap(() => this.getCountryGeoJsonByName(this.itemData.countryCode))
    //   )
    //   .subscribe();
  }

  public onMapReady(map: any) {
    this._map = map;
  }

  public getCountryGeoJsonByName(countryCode: string): void {
    this._http.get<any>('./storage/country-geojson.json')
      .pipe(
        delay(200),
        takeUntil(this._destroy$),
        map((geojson) => {
          if (geojson?.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
            throw new Error('Invalid GeoJSON format');
          }

          const feature = geojson.features.find(
            (f) => f?.properties?.countryCode?.toLowerCase() === countryCode.toLowerCase()
          );

          if (!feature) {
            throw new Error(`Country "${countryCode}" not found in GeoJSON`);
          }

          return feature;
        })
      )
      .subscribe({
        next: (feature) => {
          this.geoJson = feature;
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.error('[GeoJSON]', err.message || err);
        },
      });
  }

  private _buildData(data) {
    this.noProgress = !data;
    this.itemData = data;
    this._cdr.detectChanges();
  }

  private _watchForBreakpointChanges(): void {
    this.breakpointObserver
      .observe(['(max-width: 992px)'])
      .subscribe((state: BreakpointState) => {
        this.isLargeScreen = state.matches;
      });
  }
  private _watchForMapAPILoadChanges(): void {
    this._googleMapsLoader.apiLoaded$
      .pipe(
        delay(100)
      )
      .subscribe(() => {
        this.isApiLoaded = true;
        this.noProgress = false;
        this._cdr.detectChanges();
      });
  }

  public toggleSideBar(): void {
    this._isMapSidebar.update(current => !current);
    of(this._map)
      .pipe(
        filter(Boolean),
        delay(100),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  public onChangePaths(event) {
    this.geometry = event;
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

  public onClose(): void {
    this._dialogRef.close();
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      name: new FormControl(null),
      title: new FormControl(null),
      description: new FormControl(null),
      center: new FormControl(null),
      bbox: new FormControl(null),
    });
  }
}