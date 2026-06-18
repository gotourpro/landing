import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';

@Component({
    selector: 'app-galleria',
    standalone: true,
    imports: [
        CommonModule,
        GalleriaModule
    ],
    templateUrl: './galleria.component.html',
    styleUrls: ['./galleria.component.scss']
})
export class GalleriaComponent {
    constructor(private _cdr: ChangeDetectorRef,) {

    }

    public displayGallery = false;
    public activeIndex = 0;

    public galleryImages: any[] = [];

    public open(
        images: string[],
        activeIndex = 0
    ): void {

        this.displayGallery = false;

        this.galleryImages = images.map(image => ({
            itemImageSrc: image,
            thumbnailImageSrc: image
        }));

        this.activeIndex = activeIndex;

        this._cdr.detectChanges();

        setTimeout(() => {
            this.displayGallery = true;
            this._cdr.detectChanges();
        });
    }

}