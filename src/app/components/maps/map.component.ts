import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MapZoomControlComponent } from './components/map-zoom-control/map-zoom-control.component';
import { MapFullscreenComponent } from './components/map-fullscreen/map-fullscreen.component';
import { SidebarModule } from 'primeng/sidebar';
import { MapSidebarComponent } from './components/map-sidebar/map-sidebar.component';
import { MapSettingsControlComponent } from './components/map-settings-control/map-settings-control.component';
import { ChipModule } from 'primeng/chip';
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