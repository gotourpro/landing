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
@Component({
    selector: "app-about-team",
    standalone: true,
    templateUrl: './about-team.component.html',
    styleUrls: ['./about-team.component.scss'],
    imports: [AnimatedContainer, ParallaxDirective, TextAnimationDirective, ImageAnimationDirective, CommonModule, TranslateModule],
})
export class AboutTeamComponent {

    constructor(
        public localization: LocalizationService
    ) { }

    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());

    isWide = computed(() => this.layoutService.isWide());

    public teamItems = ABOUT_TEAM_ITEMS;
}
