import { Directive, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ArcLayer, ArcLayerProps } from '@deck.gl/layers';
import { DeckService } from '../services/deck.service';
import { deepEquals } from '@primeuix/utils';

@Directive({
    selector: 'arcLayer',
    standalone: true
})
export class ArcLayerDirective implements OnInit, OnChanges, OnDestroy {

    @Input() public visible: boolean = true;
    @Input() public options: ArcLayerProps<{}>;

    @Output() public layerClick: Subject<{ info: any; event: any }> = new Subject();
    @Output() public layerHover: Subject<{ info: any; event: any }> = new Subject();

    public arcLayer?: ArcLayer<{}>;

    private static layerCounter = 0;
    private readonly _id: string = (ArcLayerDirective.layerCounter++).toString();

    private readonly _destroy$ = new Subject<boolean>();

    constructor(
        private readonly _deckService: DeckService,
        private readonly _ngZone: NgZone,
    ) {}

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
            this.arcLayer = new ArcLayer(this._combineOptions());
            this._deckService.addLayer(this, this.arcLayer);
        });
    }

    private _updateLayer(opts: ArcLayerProps<{}>): void {
        if (this.arcLayer) {
            this._deckService.removeLayer(this);
            this.arcLayer = undefined;
        }

        this.arcLayer = new ArcLayer(opts);
        this._deckService.addLayer(this, this.arcLayer);
    }

    private _combineOptions(): ArcLayerProps<{}> {
        return {
            ...this.options,
            id: this.options.id || `arc-layer${this._id}`,
            visible: this.visible,
            onClick: (info: any, event: any) => this.layerClick.next({ info, event }),
            onHover: (info: any, event: any) => this.layerHover.next({ info, event }),
        };
    }
}