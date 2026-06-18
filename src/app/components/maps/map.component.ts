import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, Renderer2, ViewChild, ViewRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animationFrames, animationFrameScheduler, combineLatest, delay, filter, interval, map, Observable, pipe, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { LngLatBounds } from 'mapbox-gl';
import { LoadProgressService } from '../../services/load-progress.service';
import { MapZoomControlComponent } from './components/map-zoom-control/map-zoom-control.component';
// import { GeoJSONSourceComponent, NgxMapboxGLModule } from 'ngx-mapbox-gl';
// import { MapService } from './services/map-service';
import { MapFullscreenComponent } from './components/map-fullscreen/map-fullscreen.component';
import { SidebarModule } from 'primeng/sidebar';
import { MapSidebarComponent } from './components/map-sidebar/map-sidebar.component';
import { MapSettingsControlComponent } from './components/map-settings-control/map-settings-control.component';
import { LayoutService } from '../../services/layout.service';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { PathLayer } from '@deck.gl/layers';
import { MarkerIcons } from './constants/marker-icons.constant';
import { Utils } from '../../services/utils';
import { point, featureCollection } from "@turf/helpers";
import { ChipModule } from 'primeng/chip';
import { ExecutionStageType } from '../../enums/execution-stage-type.enum';
import { SkeletonModule } from 'primeng/skeleton';
import { CheckImagePipe } from '../../pipes/check-image.pipe';
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    imports: [
        CommonModule,
        SidebarModule,
        RouterModule,
        //   NgxMapboxGLModule,
        MapZoomControlComponent,
        MapFullscreenComponent,
        MapSidebarComponent,
        MapSettingsControlComponent,
        NgIf,
        ChipModule,
        SkeletonModule,
        CheckImagePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnDestroy, OnInit {

    public isVisible = false;
    
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

}