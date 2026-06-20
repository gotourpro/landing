import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../../components/animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { TranslateModule } from "@ngx-translate/core";
import { LocalizationService } from "../../../../services/localization.service";
import { CountUpModule } from 'ngx-countup';

@Component({
    selector: "app-about-testimonials",
    standalone: true,
    templateUrl: './about-testimonials.component.html',
    styleUrls: ['./about-testimonials.component.scss'],
    imports: [AnimatedContainer, CommonModule, TranslateModule, CountUpModule],
})
export class AboutTestimonialsComponent {

    constructor(
        public localization: LocalizationService
    ) { }
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());

    isWide = computed(() => this.layoutService.isWide());

    public stats = [
        {
            value: 10000,
            suffix: '+',
            textKey: 'components.about.stats.travelers'
        },
        {
            value: 50,
            suffix: '+',
            textKey: 'components.about.stats.destinations'
        },
        {
            value: 100,
            suffix: '+',
            textKey: 'components.about.stats.tours'
        },
        {
            value: 500,
            suffix: '+',
            textKey: 'components.about.stats.reviews'
        },
        {
            value: 4.9,
            decimals: 1,
            textKey: 'components.about.stats.rating'
        }
    ];

    public testimonialsImagesLeft = [
        'assets/images/resources/85x85.svg',
        'assets/images/resources/85x85.svg',
        'assets/images/resources/85x85.svg',
    ];

    public testimonialsImagesRight = [
        'assets/images/resources/85x85.svg',
        'assets/images/resources/85x85.svg',
        'assets/images/resources/85x85.svg',
    ];
}
