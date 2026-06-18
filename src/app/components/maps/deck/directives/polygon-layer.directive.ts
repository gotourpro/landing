import { Directive, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, skip, Subject, take, takeUntil } from 'rxjs';
import { PolygonLayer, PolygonLayerProps } from '@deck.gl/layers';
import { DeckService } from '../services/deck.service';
import { deepEquals } from '@primeuix/utils';

@Directive({
    selector: 'polygonLayer',
    standalone: true
})
export class PolygonLayerDirective implements OnInit, OnDestroy {

    private readonly _options = new BehaviorSubject<PolygonLayerProps<{}>>({});
    private readonly _data = new BehaviorSubject<GeoJSON.FeatureCollection | undefined>(undefined);
    private readonly _visible = new BehaviorSubject<boolean>(true);
    private readonly _destroy$ = new Subject<void>();

    @Input()
    set visible(visible: boolean) {
        this._visible.next(visible);
    }

    @Input()
    set data(data: GeoJSON.FeatureCollection) {
        this._data.next(data || {});
    }

    @Input()
    set options(options: PolygonLayerProps<{}>) {
        this._options.next(options || {});
    }

    @Output() public layerClick: Subject<{ info: any; event: any }> = new Subject();
    @Output() public layerHover: Subject<{ info: any; event: any }> = new Subject();

    public polygonLayer?: PolygonLayer<{}>;

    private static layerCounter = 0;

    private readonly _id: string = (PolygonLayerDirective.layerCounter++).toString();

    constructor(
        private readonly _deckService: DeckService,
        private readonly _ngZone: NgZone,
    ) { }

    public ngOnInit(): void {
        this._onInit();
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
        this._deckService.removeLayer(this, true);
    }

    private _onInit(): void {
        this._combineOptions()
            .pipe(take(1))
            .subscribe(options => {
                this._ngZone.runOutsideAngular(() => {
                    this.polygonLayer = new PolygonLayer(options);
                    this._assertInitialized();
                    this._deckService.addLayer(this, this.polygonLayer);
                    this._watchForCombinedChanges();
                });
            });
    }

    private _updateLayer(opts: PolygonLayerProps<{}>): void {
        if (this.polygonLayer) {
            this._deckService.removeLayer(this);
            this.polygonLayer = undefined;
        }

        this.polygonLayer = new PolygonLayer(opts);
        this._deckService.addLayer(this, this.polygonLayer);
    }

    private _combineOptions(): Observable<PolygonLayerProps<{}>> {
        return combineLatest([this._options, this._data, this._visible]).pipe(
            map(([options, data, visible]) => {
                const combinedOptions: PolygonLayerProps<{}> = {
                    ...options,
                    data: data || options?.data,
                    visible: visible !== undefined ? visible : options.visible,
                    onClick: (info: any, event: any) => this.layerClick.next({ info, event }),
                    onHover: (info: any, event: any) => this.layerHover.next({ info, event }),
                };
                return combinedOptions;
            }),
        );
    }

    private _watchForCombinedChanges(): void {
        this._combineOptions()
          .pipe(
            skip(1),
            distinctUntilChanged((prev, curr) => deepEquals(prev, curr)), 
            takeUntil(this._destroy$)
          )
          .subscribe(options => {
            this._assertInitialized();
            this._updateLayer(options);
          });
      }

    private _assertInitialized(): asserts this is { polygonLayer: PolygonLayer<{}> } {
        if (!this.polygonLayer) {
            throw new Error(
                'Cannot interact with a Deck GL Polygon Layer before it has been initialized.'
            );
        }
    }

}