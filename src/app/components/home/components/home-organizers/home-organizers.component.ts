import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { TextAnimationDirective } from "../../../../directives/text-animation/text-animation.directive";
import { ImageAnimationDirective } from "../../../../directives/image-animation/image-animation.directive";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { UICarousel } from "../../../UI/carousel";
import { UICarouselItem } from "../../../UI/carousel-item";
import { FloatingCustomers } from "../../../floatingcustomers";
import { Trimzales } from "../../../icon/customers/trimzales";
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: "app-home-organizers",
    standalone: true,
    templateUrl: './home-organizers.component.html',
    styleUrls: ['./home-organizers.component.scss'],
    imports: [AnimatedContainer, Trimzales, UICarousel, FloatingCustomers, UICarouselItem, ParallaxDirective, TextAnimationDirective, ImageAnimationDirective, CommonModule, TranslateModule],
})
export class HomeOrganizersComponent {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());

    isWide = computed(() => this.layoutService.isWide());
    isMobile = computed(() => this.layoutService.isMobile());

    clientPartners = [
        {
            logo: Trimzales,
            label: 'MDC TOURISM',
            url: 'https://mdctourism.com'
        }
    ];

}
