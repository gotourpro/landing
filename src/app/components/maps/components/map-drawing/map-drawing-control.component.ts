import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, forkJoin, from, Observable, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { GoogleMap, MapEventManager } from '@angular/google-maps';
import { simplify } from "@turf/simplify";
import { DEFAULT_DRAWING_OPTIONS } from './constants/drawing-options.constant';
import { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon, Position } from 'geojson';
import { featureCollection, feature } from "@turf/helpers";
import { ToggleButtonModule } from 'primeng/togglebutton';
@Component({
  selector: 'map-drawing-control',
  templateUrl: './map-drawing-control.component.html',
  styleUrls: ['./map-drawing-control.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    FormsModule,
    ToggleButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MapDrawingComponent implements OnInit, OnDestroy {

  public drawingManager?: google.maps.drawing.DrawingManager;
  public dataLayer?: google.maps.Data;
  private feature?: google.maps.Data.Feature;
  public isDraw: boolean;
  public isEdit: boolean;
  private readonly _map: GoogleMap = inject(GoogleMap);
  private readonly _ngZone = inject(NgZone);

  private readonly _options = new BehaviorSubject<any>(DEFAULT_DRAWING_OPTIONS);
  private readonly _geoJson = new BehaviorSubject<Feature | FeatureCollection | null>(null);
  private readonly _style = new BehaviorSubject<google.maps.Data.StyleOptions>({});
  private readonly _destroy$ = new Subject<void>();

  private drawStartSubscription?: Subscription;
  public shapeExists$ = new BehaviorSubject<boolean>(false);
  private _eventManager = new MapEventManager(this._ngZone);
  private _eventManagerDrawing = new MapEventManager(this._ngZone);
  private _eventManagerDataLayer = new MapEventManager(this._ngZone);

  @Input() public isDisabledControl = false;
  @Input() public isShowControl = true;
  @Input() public tolerance: number = 0.01;
  @Input() public fitBounds = true;

  @Input()
  set geoJson(geometry: Feature | FeatureCollection | null) {
    this._geoJson.next(geometry);
    this.shapeExists$.next(!!geometry);
    this.cd.detectChanges();
  }

  @Input()
  set options(options: google.maps.drawing.DrawingManagerOptions) {
    this._options.next(options || {});
  }

  @Input()
  set style(style: google.maps.Data.StyleOptions) {
    this._style.next(style || {});
  }


  @Output() readonly overlayComplete: Observable<google.maps.drawing.OverlayCompleteEvent> =
    this._eventManagerDrawing.getLazyEmitter<google.maps.drawing.OverlayCompleteEvent>('overlaycomplete');

  @Output() readonly setGeometry: Observable<google.maps.Data.SetGeometryEvent> =
    this._eventManagerDataLayer.getLazyEmitter<google.maps.Data.SetGeometryEvent>('setgeometry');

  @Output() readonly addFeature: Observable<google.maps.Data.SetGeometryEvent> =
    this._eventManagerDataLayer.getLazyEmitter<google.maps.Data.SetGeometryEvent>('addfeature');

  @Output() readonly removeFeature: Observable<google.maps.Data.SetGeometryEvent> =
    this._eventManagerDataLayer.getLazyEmitter<google.maps.Data.SetGeometryEvent>('removefeature');

  constructor(private cd: ChangeDetectorRef) { }

  public ngOnInit(): void {
    if (this._map._isBrowser) {
      this._ngZone.runOutsideAngular(() => {
        forkJoin({
          map: from(this._map._resolveMap()),
          drawingLib: from(google.maps.importLibrary('drawing') as Promise<any>)
        }).subscribe(({ map, drawingLib }) => {
          this._initialize(map, drawingLib);
        });
      });
    }
  }

  private _initialize(map: google.maps.Map, drawingLib: any): void {
    this._ngZone.runOutsideAngular(() => {
      this.dataLayer = new google.maps.Data({ map });
      this._eventManagerDataLayer.setTarget(this.dataLayer);
      this._eventManager.setTarget(map);
      this.dataLayer.setStyle({ ...this._style.getValue(), editable: false });

      const DrawingManagerConstructor = drawingLib.DrawingManager as new (
        options?: google.maps.drawing.DrawingManagerOptions
      ) => google.maps.drawing.DrawingManager;

      this.drawingManager = new DrawingManagerConstructor({
        drawingMode: null,
        ...this._options.getValue(),
        polygonOptions: { ...this._options.getValue().polygonOptions, ...this._style.getValue() }
      });

      this.drawingManager.setMap(map);
      this._eventManagerDrawing.setTarget(this.drawingManager);

      this._watchForOverlaycompleteChanges();
      this._watchForGeoJsonChanges();
      this._watchForStyleChanges();
    });
  }

  private simplifyFeatureCollection(
    input: Feature | FeatureCollection,
    baseTolerance: number
  ): FeatureCollection {
    const features: Feature[] = (input.type === 'FeatureCollection') ? input.features : [input];
    const simplifiedFeatures: Feature[] = [];

    for (const f of features) {
      try {
        const geom = f.geometry;
        let pointCount = 0;

        if (geom.type === 'Polygon') {
          pointCount = geom.coordinates.reduce((acc, ring) => acc + ring.length, 0);
        } else if (geom.type === 'MultiPolygon') {
          pointCount = geom.coordinates.reduce(
            (acc, polygon) => acc + polygon.reduce((innerAcc, ring) => innerAcc + ring.length, 0),
            0
          );
        }

        const adjustedTolerance =
          pointCount > 500 ? baseTolerance :
            pointCount > 200 ? baseTolerance * 0.5 :
              pointCount > 100 ? baseTolerance * 0.3 :
                pointCount > 50 ? baseTolerance * 0.1 :
                  0;

        const simplified = simplify(f, {
          tolerance: adjustedTolerance,
          highQuality: false,
          mutate: false
        });

        if (simplified.geometry.type === 'Polygon' || simplified.geometry.type === 'MultiPolygon') {
          simplifiedFeatures.push(feature(simplified.geometry, f.properties || {}));
        }
      } catch (e) {
        console.warn('Simplify error:', e);
      }
    }

    return featureCollection(simplifiedFeatures);
  }


  private _watchForStyleChanges(): void {
    this._style
      .pipe(takeUntil(this._destroy$))
      .subscribe(style => {
        if (!style || !this.dataLayer) return;
        this.dataLayer.setStyle(style);
        this.drawingManager?.setOptions({ polygonOptions: { ...this._options.getValue().polygonOptions, ...this._style.getValue() }})
      });
  }

  private _watchForGeoJsonChanges(): void {
    this._geoJson
      .pipe(takeUntil(this._destroy$))
      .subscribe(geoJson => {
        if (!geoJson || !this.dataLayer) return;

        const simplified = this.simplifyFeatureCollection(geoJson, this.tolerance);

        this.dataLayer.forEach(f => this.dataLayer!.remove(f));
        const features = this.dataLayer.addGeoJson(simplified);

        this.dataLayer.setStyle({
          ...this._style.getValue(),
          editable: false
        });

        if (geoJson.type === 'Feature' && features.length > 0) {
          this.feature = features[0];

        }
        if (this.fitBounds && features.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          features.forEach(f => this.extendBoundsFromFeature(f, bounds));
          this._map.googleMap?.fitBounds(bounds);
        }
      });
  }

  private extendBoundsFromFeature(feature: google.maps.Data.Feature, bounds: google.maps.LatLngBounds): void {
    const geometry = feature.getGeometry();

    if (geometry?.getType() === 'Polygon') {
      const polygon = geometry as google.maps.Data.Polygon;
      polygon.getArray().forEach((ring: google.maps.Data.LinearRing) => {
        ring.getArray().forEach((latlng: google.maps.LatLng) => {
          bounds.extend(latlng);
        });
      });
    } else if (geometry?.getType() === 'MultiPolygon') {
      const multiPolygon = geometry as google.maps.Data.MultiPolygon;
      multiPolygon.getArray().forEach((polygon: google.maps.Data.Polygon) => {
        polygon.getArray().forEach((ring: google.maps.Data.LinearRing) => {
          ring.getArray().forEach((latlng: google.maps.LatLng) => {
            bounds.extend(latlng);
          });
        });
      });
    }
  }


  private __watchForDrawStartChanges(): void {
    this.drawStartSubscription?.unsubscribe();
    this.drawStartSubscription = this._eventManager
      .getLazyEmitter<google.maps.MapMouseEvent>('mousedown')
      .pipe(
        filter(() => this.drawingManager?.getDrawingMode() === google.maps.drawing.OverlayType.POLYGON),
        take(1),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.onRemove();
      });
  }


  private _watchForOverlaycompleteChanges(): void {
    this.overlayComplete
      .pipe(
        tap((data) => console.log(data)),
        takeUntil(this._destroy$)
      )
      .subscribe(event => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const polygon = event.overlay as google.maps.Polygon;
          const path = polygon.getPath();
          const coordinates: number[][] = [];
          path.forEach((latlng: google.maps.LatLng) => {
            coordinates.push([latlng.lng(), latlng.lat()]);
          });
          coordinates.push([path.getAt(0).lng(), path.getAt(0).lat()]);

          if (this._geoJson.getValue()?.type === 'Feature') {
            if (this.feature) {
              this.dataLayer!.remove(this.feature);
            }
          }

          const newFeatures = this.dataLayer!.addGeoJson(
            feature({ type: 'Polygon', coordinates: [coordinates] }, {})
          );

          if (this._geoJson.getValue()?.type === 'Feature' && newFeatures.length > 0) {
            this.feature = newFeatures[0];

          }
          this.shapeExists$.next(true);
          this.__watchForDrawStartChanges();
          polygon.setMap(null);
          this.drawingManager!.setDrawingMode(null);
          this.isDraw = false;
          this.cd.detectChanges();
        }
      });
  }

  public onEdit(): void {
    if (this.dataLayer) {
      this.dataLayer.setStyle({ ...this._style.getValue(), editable: true });
    }
    this.drawingManager?.setDrawingMode(null);
  }

  public onStop(): void {
    if (this.dataLayer) {
      this.dataLayer.setStyle({ ...this._style.getValue(), editable: false });
    }
  }

  public onRemove(): void {
    if (this.dataLayer) {
      this.dataLayer.forEach(f => this.dataLayer!.remove(f));
    }
    this.shapeExists$.next(false);
    this.feature = undefined;
  }

  public onDraw(): void {
    if (this.dataLayer) {
      this.dataLayer.setStyle({ ...this._style.getValue(), editable: false });
    }
    this.drawingManager?.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    this.onRemove();
    this.cd.detectChanges();
  }

  public onDrawChange({ checked }) {
    this.drawingManager?.setDrawingMode(checked ? google.maps.drawing.OverlayType.POLYGON : null);
  }

  public onEditChange({ checked }) {
    if (this.dataLayer) {
      this.dataLayer.setStyle({ ...this._style.getValue(), editable: checked });
    }
  }


  public closeRing(coords: number[][]): number[][] {
    if (coords.length < 2) return coords;
    const [firstLng, firstLat] = coords[0];
    const [lastLng, lastLat] = coords[coords.length - 1];
  
    if (firstLng !== lastLng || firstLat !== lastLat) {
      return [...coords, coords[0]];
    }
  
    return coords;
  }
  
  public autoCloseGeometry(geometry: Geometry): Geometry {
    if (geometry.type === 'Polygon') {
      const rings = (geometry.coordinates as number[][][]).map(ring =>
        this.closeRing(ring)
      );
      return { ...geometry, coordinates: rings };
    }
  
    if (geometry.type === 'MultiPolygon') {
      const normalized = (geometry.coordinates as any[]).map((poly: any) => {
        // 🧠 Обеспечиваем, что poly — это Array<LinearRing>
        const rings = Array.isArray(poly[0][0]) ? poly : [poly]; // [[]] -> [[[]]]
        return rings.map((ring: number[][]) => this.closeRing(ring));
      });
  
      return { ...geometry, coordinates: normalized };
    }
  
    return geometry;
  }
  
  

  public getGeoJson(): Promise<FeatureCollection | null> {
    return new Promise((resolve) => {
      if (!this.dataLayer) return resolve(null);
  
      this.dataLayer.toGeoJson((data: object) => {
        const collection = data as FeatureCollection;
  
        for (const f of collection.features) {
          if (f.geometry) {
            f.geometry = this.autoCloseGeometry(f.geometry);
          }
        }
  
        resolve(collection);
      });
    });
  }
  

  public getGeoJson$(): Observable<FeatureCollection | null> {
    return from(this.getGeoJson());
  }
  

  public ngOnDestroy(): void {
    this.drawingManager?.setMap(null);
    this._eventManagerDrawing.destroy();
    this._eventManagerDataLayer.destroy();
    this._eventManager.destroy();
    this.drawStartSubscription?.unsubscribe();
    this._destroy$.next();
    this._destroy$.complete();
  }
}


