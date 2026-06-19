import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { LocalizationService } from "../../../../services/localization.service";
import { TranslateModule } from "@ngx-translate/core";
import { UICarousel } from "../../../UI/carousel";
import { UICarouselItem } from "../../../UI/carousel-item";

@Component({
    selector: "app-about-why-choose-us",
    standalone: true,
    templateUrl: './about-why-choose-us.component.html',
    styleUrls: ['./about-why-choose-us.component.scss'],
    imports: [
        AnimatedContainer,
        CommonModule,
        UICarousel,
        UICarouselItem,
        TranslateModule],
})
export class AboutWhyChooseUsComponent {

    constructor(
        public localization: LocalizationService
    ) { }

    public layoutService = inject(LayoutService);
    public isMobile = computed(() => this.layoutService.isMobile());


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

    public advantages = [
        {
            icon: 'pi pi-map',
            titleKey: 'components.about.advantages.experiences.title',
            textKey: 'components.about.advantages.experiences.text',
            delay: 100
        },
        {
            icon: 'pi pi-calendar-clock',
            titleKey: 'components.about.advantages.booking.title',
            textKey: 'components.about.advantages.booking.text',
            delay: 300
        },
        {
            icon: 'pi pi-headphones',
            titleKey: 'components.about.advantages.support.title',
            textKey: 'components.about.advantages.support.text',
            delay: 400
        }
    ];
}

