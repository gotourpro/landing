

import {
    Directive,
    Input,
    OnDestroy,
    OnInit,
    Output,
    NgZone,
    inject,
} from '@angular/core';
import { GoogleMap, MapEventManager } from '@angular/google-maps';
import { Feature, FeatureCollection } from 'geojson';
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';

@Directive({
    selector: 'map-data-layer',
    exportAs: 'mapDatalayer',
    standalone: true
})
export class MapDataLayer implements OnInit, OnDestroy {

    private readonly _map = inject(GoogleMap);
    private readonly _ngZone = inject(NgZone);
    private _eventManager = new MapEventManager(inject(NgZone));

    private readonly _options = new BehaviorSubject<any>(null);
    private readonly _geoJson = new BehaviorSubject<Feature | FeatureCollection | null>(null);
    private readonly _style = new BehaviorSubject<google.maps.Data.StyleOptions>({});
    private readonly _editable = new BehaviorSubject<boolean>(false);
    private readonly _destroy$ = new Subject<void>();

    @Input() public fitBounds = true;

    @Input()
    set geoJson(json: Feature | FeatureCollection | null) {
        this._geoJson.next(json);
    }

    @Input()
    set options(options: google.maps.Data.DataOptions) {
        this._options.next(options || {});
    }

    @Input()
    set style(style: google.maps.Data.StyleOptions) {
        this._style.next(style || {});
    }

    @Input()
    set editable(value: any) {
        this._editable.next(value);
    }

    @Output() readonly setGeometry: Observable<google.maps.Data.SetGeometryEvent> =
        this._eventManager.getLazyEmitter<google.maps.Data.SetGeometryEvent>('setgeometry');

    @Output() readonly addFeature: Observable<google.maps.Data.SetGeometryEvent> =
        this._eventManager.getLazyEmitter<google.maps.Data.SetGeometryEvent>('addfeature');

    @Output() readonly removeFeature: Observable<google.maps.Data.SetGeometryEvent> =
        this._eventManager.getLazyEmitter<google.maps.Data.SetGeometryEvent>('removefeature');

    @Output() readonly dataLayerClick: Observable<google.maps.PolyMouseEvent> =
        this._eventManager.getLazyEmitter<google.maps.PolyMouseEvent>('click');

    @Output() readonly dataLayerDblclick: Observable<google.maps.PolyMouseEvent> =
        this._eventManager.getLazyEmitter<google.maps.PolyMouseEvent>('dblclick');

    @Output() readonly dataLayerDrag: Observable<google.maps.MapMouseEvent> =
        this._eventManager.getLazyEmitter<google.maps.MapMouseEvent>('drag');


    public dataLayer?: google.maps.Data

    constructor() { }

    public ngOnInit() {
        if (!this._map._isBrowser) return;

        this._combineOptions()
            .pipe(
                take(1),
                switchMap(options =>
                    google.maps.Data && this._map.googleMap
                        ? (this._initialize(this._map.googleMap, google.maps.Data, options), of(null))
                        : from(this._map._resolveMap())
                            .pipe(
                                switchMap(map =>
                                    from(google.maps.importLibrary('maps'))
                                        .pipe(
                                            switchMap(lib => {
                                                this._initialize(map, (lib as google.maps.MapsLibrary).Data, options);
                                                return of(null);
                                            })
                                        )
                                )
                            )
                )
            )
            .subscribe();
    }

    private _initialize(
        map: google.maps.Map,
        dataLayerConstructor: typeof google.maps.Data,
        options: google.maps.Data.DataOptions,
    ) {

        this._ngZone.runOutsideAngular(() => {
            this.dataLayer = new dataLayerConstructor(options);
            this._assertInitialized();
            this.dataLayer.setMap(map);
            this._eventManager.setTarget(this.dataLayer);
            this._watchForStyleChanges();
            this._watchForGeoJsonChanges();
            this._watchFoEditableChanges();
        });
    }

    public ngOnDestroy(): void {
        this._eventManager.destroy();
        this._destroy$.next();
        this._destroy$.complete();
        this.dataLayer?.setMap(null);
    }

    private _combineOptions(): Observable<google.maps.Data.DataOptions> {
        return combineLatest([this._style])
            .pipe(
                map(([style]) => {
                    const combinedOptions: google.maps.Data.DataOptions = {
                        style,
                        map: this._map.googleMap!
                    };
                    return combinedOptions;
                }),
            );
    }


    private _watchForStyleChanges() {
        this._style.pipe(takeUntil(this._destroy$)).subscribe(style => {
            if (style) {
                this._assertInitialized();
                this.dataLayer?.setStyle(style);
            }
        });
    }

    private _watchForGeoJsonChanges() {
        this._geoJson
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe(geojson => {
                if (geojson && this.dataLayer) {
                    this.dataLayer.forEach(feature => {
                        this.dataLayer!.remove(feature);
                    });
                    const features = this.dataLayer.addGeoJson(geojson);

                    if (this.fitBounds && features.length > 0) {
                        const bounds = new google.maps.LatLngBounds();
                        features.forEach(f => this.extendBoundsFromFeature(f, bounds));
                        this._map.googleMap?.fitBounds(bounds);
                    }
                }
            });
    }

    public fitToFeatureById(id: string | number): void {
        if (!this.dataLayer) return;

        const feature = this.dataLayer.getFeatureById(id);
        if (!feature) return;

        const bounds = new google.maps.LatLngBounds();
        this.extendBoundsFromFeature(feature, bounds);
        this._map.googleMap?.fitBounds(bounds);
    }


    public getFeatureById(id: string | number): any {
        if (!this.dataLayer) return;
        return this.dataLayer.getFeatureById(id);

    }

    public getFeatureByIdProperties(id: string | number): Record<string, any> | null {
        if (!this.dataLayer) return null;

        const feature = this.dataLayer.getFeatureById(id);
        return feature ? this.getAllProperties(feature) : null;
    }


    public highlightFeatureById(id: string | number, style: google.maps.Data.StyleOptions = { fillColor: '#FF0000', strokeColor: '#FF0000', strokeWeight: 2 }): void {
        if (!this.dataLayer) return;

        const feature = this.dataLayer.getFeatureById(id);
        if (feature) {
            this.dataLayer.overrideStyle(feature, style);
        }
    }


    public resetFeatureStyles(): void {
        this.dataLayer?.revertStyle();
    }

    public getAllProperties(feature: google.maps.Data.Feature): Record<string, any> {
        const props: Record<string, any> = {};
        feature.forEachProperty((value, name) => {
            props[name] = value;
        });
        return props;
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

    private _watchFoEditableChanges() {
        this._editable
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe(editable => {
                if (editable && this.dataLayer) {
                    this.dataLayer.setStyle({ ...this._style.getValue(), editable });
                }
            });
    }

    private _assertInitialized(): asserts this is { polygon: google.maps.Data } {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.dataLayer) {
                throw Error(
                    'Cannot interact with a Google Map Data before it has been ' +
                    'initialized. Please wait for the Google Map Data to load before trying to interact with it.',
                );
            }
        }
    }
}