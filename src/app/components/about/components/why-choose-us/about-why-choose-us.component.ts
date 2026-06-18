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

