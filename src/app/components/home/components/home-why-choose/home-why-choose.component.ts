import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../../components/animatedcontainer";
import { CirclePattern } from "../../../../components/circlepattern";
import { LayoutService } from "../../../../services/layout.service";
import { TextAnimationDirective } from "../../../../directives/text-animation/text-animation.directive";
import { ImageAnimationDirective } from "../../../../directives/image-animation/image-animation.directive";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { UICarousel } from "../../../../components/UI/carousel";
import { UICarouselItem } from "../../../../components/UI/carousel-item";
import { TranslateModule } from "@ngx-translate/core";
import { HOME_WHY_CHOOSE_ITEMS } from "../../constants/home-wh-choose-items.constants";
@Component({
    selector: "app-home-why-choose",
    standalone: true,
    templateUrl: './home-why-choose.component.html',
    styleUrls: ['./home-why-choose.component.scss'],
    imports: [AnimatedContainer, ParallaxDirective, UICarousel, UICarouselItem, TextAnimationDirective, ImageAnimationDirective, CommonModule, TranslateModule],
})
export class HomeWhyChooseComponent {
    layoutService = inject(LayoutService);

    isMobile = computed(() => this.layoutService.isMobile());

    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());

    isWide = computed(() => this.layoutService.isWide());

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

     public whyChooseItems = HOME_WHY_CHOOSE_ITEMS;

}
