import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { TextAnimationDirective } from "../../../../directives/text-animation/text-animation.directive";
import { ImageAnimationDirective } from "../../../../directives/image-animation/image-animation.directive";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { TranslateModule } from "@ngx-translate/core";
import { LocalizationService } from '../../../../services/localization.service';
import { ABOUT_TEAM_ITEMS } from "../../constants/about-team.constant";
import { UICarousel } from "../../../UI/carousel";
import { UICarouselItem } from "../../../UI/carousel-item";
import { ImageService } from "../../../../services/image-service";
@Component({
    selector: "app-about-team",
    standalone: true,
    templateUrl: './about-team.component.html',
    styleUrls: ['./about-team.component.scss'],
    imports: [AnimatedContainer,
        ParallaxDirective,
        TextAnimationDirective,
        ImageAnimationDirective,
        CommonModule,
        UICarousel,
        UICarouselItem,
        TranslateModule],
})
export class AboutTeamComponent {

    constructor(
        public localization: LocalizationService,
        public image: ImageService,
    ) { }

    public layoutService = inject(LayoutService);
    public isMobile = computed(() => this.layoutService.isMobile());

    public teamItems = ABOUT_TEAM_ITEMS;

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
}
