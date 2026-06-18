
import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AnimatedContainer } from "../../../../components/animatedcontainer";
import { ToursService } from "../../services/tours.service";
import { LocalizationService } from "../../../../services/localization.service";
import { ITour } from "../../interfaces/tour.interface";
import { GalleriaComponent } from "../../../galleria/galleria.component";
import { ButtonModule } from "primeng/button";
import { HeaderComponent } from "../../../header/header.component";
import { MenuComponent } from "../../../menu/components/menu.component";
import { FooterComponent } from "../../../footer/footer.component";
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: "app-tour-list",
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        AnimatedContainer,
        ButtonModule,
        GalleriaComponent,
        HeaderComponent,
        MenuComponent,
        AnimatedContainer,
        FooterComponent,
        TranslateModule
    ],
    templateUrl: './tour-list.component.html',
})
export class TourListComponent {

    @ViewChild('gallery')
    public galleria: GalleriaComponent;

    public title = 'Tour List';
    public description = ''
    public tours: ITour[] = [];
    public page = 1;
    public limit = 3;
    public hasMore = true;
    public loading = false;

    constructor(
        private toursService: ToursService,
        public localization: LocalizationService
    ) { }


    public ngOnInit(): void {
        this.loadMore();
    }

    ngAfterViewInit(): void {
    }

    public loadMore(): void {

        if (!this.hasMore || this.loading) {
            return;
        }

        this.loading = true;

        this.toursService
            .getPage(this.page, this.limit)
            .subscribe(response => {

                this.tours = [
                    ...this.tours,
                    ...response.items
                ];

                this.hasMore = response.hasMore;
                this.page++;
                this.loading = false;
            });
    }


    public openGallery(item: any): void {

        const images = item.images?.length
            ? item.images
            : [item.image];
        this.galleria.open(images);
    }
}
