import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';

@Component({
    selector: 'map-location-control',
    templateUrl: './map-location-control.component.html',
    styleUrls: ['./map-location-control.component.scss'],
    imports: [CommonModule, ButtonModule, TooltipModule, FormsModule,MapAdvancedMarker],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapLocationControlComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public style: { [key: string]: string } = {
    width: '38px',
    height: '38px',
  };

  public map!: google.maps.Map;
  private readonly _map = inject(GoogleMap);

  public locatedPosition: google.maps.LatLngLiteral | null = null;

  public markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    title: '',
    collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
  };

  public locating = false;

  private _destroy$ = new Subject<void>();

  constructor(
    private _cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {
    this._watchForLoadChanges();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.locatedPosition = null;
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _watchForLoadChanges() {
    this._map.mapInitialized
      .pipe(
        filter(Boolean),
        takeUntil(this._destroy$),
      )
      .subscribe((map: google.maps.Map) => {
        this.map = map;
      });
  }

  public onLocateUser(): void {
    if (!isPlatformBrowser(this.platformId) || !navigator.geolocation) {
      console.warn('Geolocation not available');
      return;
    }

    this.locating = true;
    this._cdr.markForCheck();

    navigator.geolocation.getCurrentPosition(
      pos => {
        this.ngZone.run(() => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          this.map.setCenter(coords);
          this.map.setZoom(14);

          this.locatedPosition = coords;
          this.locating = false;
          this._cdr.markForCheck();
        });
      },
      err => {
        console.error('Geolocation error:', err);
        this.ngZone.run(() => {
          this.locating = false;
          this._cdr.markForCheck();
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }
}