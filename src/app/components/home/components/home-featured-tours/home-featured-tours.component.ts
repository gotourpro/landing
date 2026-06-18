import { Component, computed, inject, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { GridCardComponent } from "../../../grid-card/grid-card.component";
import { twMerge } from "tailwind-merge";
import { ITour } from "../../../tours/interfaces/tour.interface";
import { ToursService } from "../../../tours/services/tours.service";
import { LocalizationService } from "../../../../services/localization.service";
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";
import { GalleriaComponent } from "../../../galleria/galleria.component";
import { UICarouselItem } from "../../../UI/carousel-item";
import { UICarousel } from "../../../UI/carousel";
@Component({
    selector: "app-home-featured-tours",
    standalone: true,
    templateUrl: './home-featured-tours.component.html',
    styleUrls: ['./home-featured-tours.component.scss'],
    imports: [
        CommonModule,
        RouterLink,
        GalleriaComponent,
        AnimatedContainer,
        TranslateModule,
        GridCardComponent,
        ParallaxDirective,
        UICarousel,
        UICarouselItem
    ],
})
export class HomeFeaturedToursComponent {
    @ViewChild(GalleriaComponent)

    public galleria!: GalleriaComponent;
    public layoutService = inject(LayoutService);
    public twMerge = twMerge;
    public isDarkTheme = computed(() => this.layoutService?.isDarkTheme());
    public isMobile = computed(() => this.layoutService.isMobile());

    public getDelay(index: number): number {
        return index * 100;
    }

    public tours: ITour[] = [];

    constructor(
        private toursService: ToursService,
        public localization: LocalizationService
    ) { }

    public breakpoints = {
        576: {
            size: '100%',
            spacing: '14px'
        },

        992: {
            size: '50%',
            spacing: '24px'
        },

        1200: {
            size: '33.333%',
            spacing: '24px'
        }
    };


    public ngOnInit(): void {
        this.toursService
            .getFeatured()
            .subscribe(tours => {
                this.tours = tours.slice(0, 6);
            });
    }

    public openGallery(
        tour: ITour
    ): void {

        const images = tour.images?.length
            ? tour.images
            : [tour.image];

        this.galleria.open(images);
    }
    public getTourGridClass(index: number): string {
        const classes = [
            'mb-6 xl:absolute xl:top-0 xl:left-0 xl:w-[370px] xl:h-[430px]',
            'mb-6 xl:absolute xl:top-0 xl:left-[391px] xl:w-[761px] xl:h-[260px]',
            'mb-6 xl:absolute xl:top-[281px] xl:left-[782px] xl:w-[370px] xl:h-[280px]',
            'mb-6 xl:absolute xl:top-[281px] xl:left-[391px] xl:w-[370px] xl:h-[520px]',
            'mb-6 xl:absolute xl:top-[451px] xl:left-0 xl:w-[370px] xl:h-[350px]',
            'mb-6 xl:absolute xl:top-[582px] xl:left-[782px] xl:w-[370px] xl:h-[219px]',
        ];

        return classes[index] ?? '';
    }

}
