import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { GoogleMap } from '@angular/google-maps';
import { DirectionStateService } from '../map-directions/services/direction-state.service';

@Component({
    selector: 'map-fitbounds-control',
    templateUrl: './map-fitbounds-control.component.html',
    styleUrls: ['./map-fitbounds-control.component.scss'],
    imports: [CommonModule, ButtonModule, TooltipModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapFitboundsControlComponent implements OnDestroy, OnInit, AfterViewInit {

    @Input() public style: { [key: string]: string } = {
        width: '38px',
        height: '38px',
    };

    public map: google.maps.Map;
    private readonly _map = inject(GoogleMap);
    public state$ = this.directionState.state$;
    private _destroy$ = new Subject<boolean>();

    constructor(
        private _cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        private ngZone: NgZone,
        private directionState: DirectionStateService
    ) {
        this._watchForLoadChanges();
    }

    public ngOnInit(): void { }

    public ngAfterViewInit() { }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    private _watchForLoadChanges() {
        this._map.mapInitialized
            .pipe(
                filter(Boolean),
                takeUntil(this._destroy$),
            )
            .subscribe((map: any) => {
                this.map = map;
            });
    }

    public onFitBounds(): void {
        this.directionState.requestFitBounds();
    }


}