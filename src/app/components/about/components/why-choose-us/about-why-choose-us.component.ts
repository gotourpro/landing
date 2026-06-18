import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { LocalizationService } from "../../../../services/localization.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-about-why-choose-us",
    standalone: true,
    templateUrl: './about-why-choose-us.component.html',
    styleUrls: ['./about-why-choose-us.component.scss'],
    imports: [AnimatedContainer, CommonModule, TranslateModule],
})
export class AboutWhyChooseUsComponent {

    constructor(
        public localization: LocalizationService
    ) { }

    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());

    isWide = computed(() => this.layoutService.isWide());

    public advantages = [
        {
            icon: 'flaticon-suitcase',
            titleKey: 'components.about.advantages.experiences.title',
            textKey: 'components.about.advantages.experiences.text',
            delay: 100
        },
        {
            icon: 'flaticon-group',
            titleKey: 'components.about.advantages.guides.title',
            textKey: 'components.about.advantages.guides.text',
            delay: 200
        },
        {
            icon: 'flaticon-appointment',
            titleKey: 'components.about.advantages.booking.title',
            textKey: 'components.about.advantages.booking.text',
            delay: 300
        },
        {
            icon: 'flaticon-customer',
            titleKey: 'components.about.advantages.support.title',
            textKey: 'components.about.advantages.support.text',
            delay: 400
        }
    ];
}

