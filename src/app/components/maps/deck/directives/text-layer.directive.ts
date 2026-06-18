import { Directive, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { TextLayer, TextLayerProps } from '@deck.gl/layers';
import { DeckService } from '../services/deck.service';
import { deepEquals } from '@primeuix/utils';

@Directive({
    selector: 'textLayer',
    standalone: true
})
export class TextLayerDirective implements OnInit, OnChanges, OnDestroy {

    @Input() public visible: boolean = true;
    @Input() public options: TextLayerProps<{}>;
    @Input() public data: GeoJSON.FeatureCollection = undefined as any;

    @Output() public layerClick: Subject<{ info: any; event: any }> = new Subject();
    @Output() public layerHover: Subject<{ info: any; event: any }> = new Subject();

    public textLayer?: TextLayer<{}>;

    private static layerCounter = 0;

    private readonly _id: string = (TextLayerDirective.layerCounter++).toString();

    private readonly _destroy$ = new Subject<boolean>();

    constructor(
        private readonly _deckService: DeckService,
        private readonly _ngZone: NgZone,
    ) { }

    public ngOnInit(): void {
        this._onInit();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['visible']?.previousValue !== changes['visible']?.currentValue ||
            !deepEquals(changes['options']?.previousValue, changes['options']?.currentValue)
        ) {
            this._updateLayer({ ...this._combineOptions(), visible: this.visible });
        }
    }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
        this._deckService.removeLayer(this, true);
    }

    private _onInit(): void {
        this._ngZone.runOutsideAngular(() => {
            this.textLayer = new TextLayer(this._combineOptions());
            this._deckService.addLayer(this, this.textLayer);
        });
    }

    private _updateLayer(opts: TextLayerProps<{}>): void {
        if (this.textLayer) {
            this._deckService.removeLayer(this);
            this.textLayer = undefined;
        }

        this.textLayer = new TextLayer(opts);
        this._deckService.addLayer(this, this.textLayer);
    }

    private _combineOptions(): TextLayerProps<{}> {
        return {
            ...this.options,
            data: this.data || this.options?.data ||[],
            id: this.options?.id || `text-layer${this._id}`,
            visible: this.visible,
            onClick: (info: any, event: any) => this.layerClick.next({ info, event }),
            onHover: (info: any, event: any) => this.layerHover.next({ info, event }),
        };
    }
    private _assertInitialized(): asserts this is { textLayer: TextLayerProps<{}> } {
        if (!this.textLayer) {
            throw Error(
                'Cannot interact with a Deck Gl Text Layer before it has been initialized. ' +
                'Please wait for the Text Layer to load before trying to interact with it.');
        }
    }

}