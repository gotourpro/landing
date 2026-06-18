import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { distinctUntilChanged, EMPTY, filter, merge, mergeMap, Subject, takeUntil, tap, throttleTime, timer } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DirectionStateService } from './services/direction-state.service';
import { DirectionService } from './services/direction.service';
import { IDirectionState } from './interfaces/direction-state.interface';
import { Feature, Point } from 'geojson';
import { GoogleMap, MapAdvancedMarker, MapDirectionsRenderer, MapDirectionsService, MapEventManager } from '@angular/google-maps';
@Component({
    selector: 'map-directions',
    templateUrl: './map-directions.component.html',
    styleUrls: ['./map-directions.component.scss'],
    imports: [CommonModule, ButtonModule, TooltipModule, FormsModule, MapAdvancedMarker, MapDirectionsRenderer],
    providers: [MapDirectionsService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapDirectionsComponent implements OnInit, OnDestroy {
    private readonly _ngZone = inject(NgZone);
    public map: google.maps.Map; private readonly _map = inject(GoogleMap);
    public markers: MarkerData[] = [];
    private _eventManager = new MapEventManager(this._ngZone);
    public directionsRenderers: DirectionsRendererData[] = [];
    private isDragging = false;
    public isZooming = false;
    public lastZoomLevel;
    public lastValidCenter?: google.maps.LatLngLiteral;
    public lastCenter?: google.maps.LatLngLiteral;
    public centerMarkerPosition: any;
    public markerState: '' | 'moving' = '';
    private lastResult!: google.maps.DirectionsResult;
    private destroy$ = new Subject<void>();
    constructor(
        private cdr: ChangeDetectorRef,
        private dirService: DirectionService,
        public state: DirectionStateService
    ) {
        this._watchForLoadChanges();
        this._watchForMapDragStartChanges();
        this._watchForMapDragChanges();
        this._watchForMapDragEndChanges();
        this._watchForMapIdleChanges();
        this._watchForMapZoomChanges();

    }

    private updateMarkerPosition() {
        const center = this.map?.getCenter()?.toJSON();
        if (center && !this.isZooming) {
            this.centerMarkerPosition = center;
            this.lastCenter = center;
            this.cdr.markForCheck();
        }
    }

    shouldShowCenterMarker(): boolean {
        const state = this.state.getState();
        return (
            !state.routes.length &&
            !!this.centerMarkerPosition
        );
    }

    private _watchForLoadChanges() {
        this._map.mapInitialized
            .pipe(
                filter(Boolean), takeUntil(this.destroy$)
            )
            .subscribe((map: any) => {
                this.map = map;
                this._eventManager.setTarget(map);
                this.centerMarkerPosition = map.getCenter().toJSON();
                this.cdr.markForCheck();
            });

    }


    private _watchForMapZoomChanges(): void {
        this._eventManager.getLazyEmitter('zoom_changed')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.markerState = 'moving';
                this.cdr.markForCheck()
                const currentZoom = this.map?.getZoom();

                if (this.lastZoomLevel !== undefined && currentZoom !== this.lastZoomLevel) {
                    this.isZooming = true;
                    this.lastValidCenter = this.centerMarkerPosition;
                }

                this.lastZoomLevel = currentZoom;
                this.cdr.markForCheck()
            });

    }

   private _watchForMapIdleChanges(): void {
  this._eventManager.getLazyEmitter('idle')
    .pipe(
      takeUntil(this.destroy$),
      tap(() => {
        this.markerState = '';
        this.cdr.markForCheck();
      }),
      mergeMap(() => {
        if (this.isZooming) {
          return timer(100).pipe(
            tap(() => {
              this.isZooming = false;
              this.cdr.markForCheck();
            })
          );
        } else {
          this.updateMarkerPosition();
          if (this.shouldShowCenterMarker()) {
            this.dirService.setOrigin(this.centerMarkerPosition);
          }
          return EMPTY;
        }
      })
    )
    .subscribe();
}

    private _watchForMapDragStartChanges(): void {
        this._eventManager
            .getLazyEmitter('dragstart')
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.markerState = 'moving';
                this.cdr.markForCheck();
            });
    }


    private _watchForMapDragEndChanges(): void {
        this._eventManager
            .getLazyEmitter('dragend')
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.markerState = ''!;
            });
    }

    private _watchForMapDragChanges(): void {
        this._eventManager.getLazyEmitter('drag')
            .pipe(
                takeUntil(this.destroy$),
                throttleTime(50)
            )
            .subscribe(() => {
                this.isZooming = false;
                this.updateMarkerPosition();
            });
    }

    public ngOnInit(): void {

        this.state.fitBoundsTrigger$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.fitBounds());


        this.dirService.directionsResult$
            .pipe(filter(res => !!res), takeUntil(this.destroy$))
            .subscribe(res => {
                this.lastResult = res!;
                this.render(this.state.getState());
            });

        this.state.state$
            .pipe(filter(() => !!this.lastResult), takeUntil(this.destroy$))
            .subscribe(s => this.render(s));

        this.state.state$
            .pipe(
                filter(s => !!s.origin && !!s.destination),
                distinctUntilChanged((a, b) =>
                    JSON.stringify(a) === JSON.stringify(b)
                ),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.dirService.fetchDirections());
    }

    public ngOnDestroy(): void {
        this._eventManager.destroy();
        this.destroy$.next();
        this.destroy$.complete();
    }

    trackBy(index: number, m: MarkerData): string {
        return m.label;
    }

    fitBounds(): void {
        if (!this.lastResult) {
            return;
        }
        const state = this.state.getState();
        const selIdx = state.selectedRouteIndex;
        const route = this.lastResult.routes[selIdx];
        if (!route) {
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        route.overview_path.forEach(point => bounds.extend(point));

        const padding = { top: 200, bottom: 200, left: 500, right: 100 };
        this.map.fitBounds(bounds, padding);
    }

    private render(state: IDirectionState) {
        // 1) Собирать маркеры
        const buildMarker = (
            feature: Feature<Point>,
            label: string,
            color: string
        ): MarkerData => {
            const [lng, lat] = feature.geometry.coordinates;
            const position = { lat, lng };
            const content = this.createMarkerContent(label, color, feature.properties?.['name']);
            const options: google.maps.marker.AdvancedMarkerElementOptions = {
                collisionBehavior:
                    google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
                gmpDraggable: true,
                title: feature.properties?.['name'] ?? '-',
            };
            return { feature, label, position, content, options };
        };

        const markers: MarkerData[] = [];
        if (state.origin && state.routes.length > 0) {
            markers.push(buildMarker(state.origin, 'A', '#4CAF50'));
        }
        if (state.destination) {
            markers.push(buildMarker(state.destination, 'B', '#F44336'));
        }
        state.waypoints?.forEach((wp, i) =>
            markers.push(buildMarker(wp, `${i + 1}`, '#2196F3'))
        );
        this.markers = markers;

        const drs: DirectionsRendererData[] = state.routes.map((route, idx) => ({
            directions: { ...this.lastResult, routes: [route] },
            options: {
                suppressMarkers: true,
                preserveViewport: true,
                draggable: false,
                polylineOptions: {
                    strokeColor:
                        idx === state.selectedRouteIndex ? '#007bff' : '#999',
                    strokeOpacity: 1,
                    strokeWeight: 6,
                },
            },
        }));
        this.directionsRenderers = drs;

        // 3) Авто-фит по bounds
        if (state.routes.length) {
            this.fitBounds();
        }

        this.cdr.markForCheck();
    }

    onMarkerDragEnd(
        event: any,
        markerData: MarkerData
    ) {
        if (!event.latLng) return;
        const coord = event.latLng.toJSON();
        switch (markerData.label) {
            case 'A':
                this.dirService.setOrigin(coord);
                break;
            case 'B':
                this.dirService.setDestination(coord);
                break;
            default:
                this.dirService.updateWaypoint(
                    +markerData.label - 1,
                    coord
                );
        }
    }

    onMarkerClick(idx: number) {
        this.state.selectRoute(idx);
    }

    selectRoute(idx: number) {
        this.state.selectRoute(idx);
    }

    private createMarkerContent(
        label: string,
        color: string,
        caption: string = ''
    ): HTMLElement {
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'auto',
        });

        const iconDiv = document.createElement('div');
        iconDiv.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14"
                fill="${color}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle"
              font-family="Roboto, Arial, sans-serif"
              font-size="12" font-weight="bold"
              fill="white">${label}</text>
      </svg>`;
        container.appendChild(iconDiv);

        if (caption) {
            const textDiv = document.createElement('div');
            textDiv.textContent = caption;
            Object.assign(textDiv.style, {
                marginLeft: '6px',
                maxWidth: '180px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'Roboto, Arial, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgba(0,0,0,0.87)',
                backgroundColor: 'var(--p-card-background)',
                opacity: '0.9',
                padding: '4px 8px',
                borderRadius: '4px',
                textShadow: [
                    ' 1px  1px 0 #fff',
                    '-1px  1px 0 #fff',
                    ' 1px -1px 0 #fff',
                    '-1px -1px 0 #fff',
                ].join(','),
            });
            container.appendChild(textDiv);
        }
        return container;
    }
}

interface MarkerData {
    feature: Feature<Point>;
    label: string;
    position: google.maps.LatLngLiteral;
    content: HTMLElement;
    options: google.maps.marker.AdvancedMarkerElementOptions;
}

interface DirectionsRendererData {
    directions: google.maps.DirectionsResult;
    options: google.maps.DirectionsRendererOptions;
}
