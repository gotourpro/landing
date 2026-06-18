import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { TextAnimationDirective } from "../../../../directives/text-animation/text-animation.directive";
import { ImageAnimationDirective } from "../../../../directives/image-animation/image-animation.directive";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { UICarousel } from "../../../UI/carousel";
import { UICarouselItem } from "../../../UI/carousel-item";
import { DestinationsService } from "../../../destinations/services/destinations.service";
import { LocalizationService } from "../../../../services/localization.service";
import { TranslateModule } from "@ngx-translate/core";
import { IDestination } from "../../../destinations/interfaces/destination.interface";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-home-destinations",
    standalone: true,
    templateUrl: './home-destinations.component.html',
    styleUrls: ['./home-destinations.component.scss'],
    imports: [
        AnimatedContainer,
        UICarousel,
        UICarouselItem,
        ParallaxDirective,
        TextAnimationDirective,
        ImageAnimationDirective,
        RouterLink,
        CommonModule,
        TranslateModule
    ],
})
export class HomeDestinationsComponent {

    constructor(
        private destinationsService: DestinationsService,
        public localization: LocalizationService
    ) { }

    public destinationItems: IDestination[] = [];
    public layoutService = inject(LayoutService);
    public isMobile = computed(() => this.layoutService.isMobile());
    public isDarkTheme = computed(() => this.layoutService?.isDarkTheme());


    public breakpoints = {
        576: {
            size: '100%',
            spacing: '24px'
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
        this.destinationsService
            .getPopular()
            .subscribe(items => {
                this.destinationItems = items;
            });
    }
}
