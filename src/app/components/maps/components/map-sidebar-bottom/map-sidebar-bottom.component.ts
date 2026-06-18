import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MapService } from '../../services/map-service';
import { delay, filter, Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { lineChunk } from "@turf/line-chunk";
import { ChartModule } from 'primeng/chart';
import { point, featureCollection, lineString, } from "@turf/helpers";

@Component({
    selector: 'map-sidebar-bottom',
    templateUrl: './map-sidebar-bottom.component.html',
    styleUrls: ['./map-sidebar-bottom.component.scss'],
    imports: [CommonModule, ChartModule, ReactiveFormsModule, ButtonModule, SidebarModule, MultiSelectModule, FloatLabelModule, CascadeSelectModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MapSidebarBottomComponent implements OnDestroy, OnInit {

    @ViewChild('chart', { static: true }) chart: any;

    @Input() public isVisible = false;
    @Output() public visibleChange: Subject<boolean> = new Subject<boolean>();

    public form: FormGroup;
    public state: any[] = [];
    public style: string;

    data: any;

    options: any;

    private _map: any;
    private _destroy$ = new Subject<boolean>();


    constructor(
        private _fb: FormBuilder,
        private _mapService: MapService,
        private _cdr: ChangeDetectorRef,
    ) {
        this._watchForLoadChanges();


    }

    public ngOnInit(): void {
    }
    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }


    public onClose(): void {
        this.isVisible = false;
        this.visibleChange.next(this.isVisible);
    }

    public onVisibleChange(event: any): void {
        this.visibleChange.next(event);
    }

    private _watchForLoadChanges() {
        this._mapService.load$
            .pipe(
                filter(Boolean),
                takeUntil(this._destroy$),
            )
            .subscribe((data: any) => {
                this._map = data;
            });
    }

    private _buildForm(): void {
        this.form = this._fb.group({});
    }

}
