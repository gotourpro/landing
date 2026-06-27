import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IDestination } from '../../interfaces/destination.interface';
import { DestinationsService } from '../../services/destinations.service';
import { AnimatedContainer } from '../../../animatedcontainer';
import { ViewChild } from '@angular/core';
import { GalleriaComponent } from '../../../galleria/galleria.component';
import { HeaderComponent } from '../../../header/header.component';
import { MenuComponent } from '../../../menu/components/menu.component';
import { FooterComponent } from '../../../footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService } from '../../../../services/localization.service';
import { ImageService } from '../../../../services/image-service';
@Component({
    selector: 'app-destination-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ButtonModule,
        GalleriaComponent,
        HeaderComponent,
        MenuComponent,
        AnimatedContainer,
        FooterComponent,
        TranslateModule
    ],
    templateUrl: './destination-list.component.html',
    styleUrls: ['./destination-list.component.scss']
})
export class DestinationListComponent {
    @ViewChild('gallery')
    public galleria: GalleriaComponent;
    public title = 'Destination List';
    public description = ''
    public destinations: IDestination[] = [];
    public page = 1;
    public limit = 3;
    public hasMore = true;
    public loading = false;

    constructor(
        private destinationsService: DestinationsService,
        public localization: LocalizationService,
        public image: ImageService,
    ) { }
    public ngOnInit(): void {
        this.loadMore();
    }

    public loadMore(): void {

        if (!this.hasMore || this.loading) {
            return;
        }

        this.loading = true;

        this.destinationsService
            .getPage(this.page, this.limit)
            .subscribe(response => {

                this.destinations = [
                    ...this.destinations,
                    ...response.items
                ];

                this.hasMore = response.hasMore;
                this.page++;

                this.loading = false;
            });
    }

    public openGallery(item: IDestination): void {

        const images = (
            item.images?.length
                ? item.images
                : [item.image]
        ).map(image => this.image.getImage(image, 1600));

        this.galleria.open(images);
    }
}