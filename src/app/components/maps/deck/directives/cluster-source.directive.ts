import { Directive, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, inject, OnDestroy, OnInit } from '@angular/core';
import Supercluster from 'supercluster';
import { GoogleMap } from '@angular/google-maps';
import { Subject, takeUntil, tap } from 'rxjs';

@Directive({
    selector: 'clusterSource',
    standalone: true
})
export class ClusterSourceDirective implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @Input() public data: any;
    @Input() public clusterRadius: number = 180;
    @Input() public minZoom: number = 4;
    @Input() public maxZoom: number = 22;
    @Input() public minPoints: number = 2;
    @Output() public clusteredData = new EventEmitter<GeoJSON.FeatureCollection>();

    private supercluster: Supercluster;

    private readonly _map: GoogleMap = inject(GoogleMap);

    public destroy$ = new Subject<boolean>();

    constructor() {
        this._initSupercluster();
    }
    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private _initSupercluster(): void {
        this.supercluster = new Supercluster({
            radius: this.clusterRadius,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            minPoints: this.minPoints
        });
    }

    public ngAfterViewInit(): void { }

    public ngOnInit(): void {
        this._map.idle
            .pipe(
                takeUntil(this.destroy$),
                tap(() => this._updateClusters())
            )
            .subscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['clusterRadius'] || changes['minZoom'] || changes['maxZoom'] || changes['minPoints']) {
            this._initSupercluster();
            this._updateClusters();
        }
    }

    private _updateClusters(): void {
        if (typeof this.data === 'string') {
            fetch(this.data)
                .then(res => res.json())
                .then(json => this._processClusters(json))
                .catch(error => console.error('Failed to fetch data:', error));
        } else {
            this._processClusters(this.data);
        }
    }

    private _processClusters(data: GeoJSON.FeatureCollection): void {
        if (!data || data.features.length === 0) return;

        this.supercluster.load(data.features as any);

        const zoom = this._map.googleMap?.getZoom() ?? this.maxZoom;

        let bbox: [number, number, number, number];
        const bounds = this._map.googleMap?.getBounds();
        if (bounds) {
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            bbox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
        } else {
            bbox = [-180, -90, 180, 90];
        }

        const clusters = this.supercluster.getClusters(bbox, Math.floor(zoom));
        this.clusteredData.emit({ type: 'FeatureCollection', features: clusters });
    }
}
