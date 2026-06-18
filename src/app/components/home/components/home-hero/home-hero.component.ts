import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { CirclePattern } from "../../../circlepattern";
import { LayoutService } from "../../../../services/layout.service";
import { TextAnimationDirective } from "../../../../directives/text-animation/text-animation.directive";
import { ImageAnimationDirective } from "../../../../directives/image-animation/image-animation.directive";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: "app-home-hero",
    standalone: true,
    templateUrl: './home-hero.component.html',
    styleUrls: ['./home-hero.component.scss'],
    imports: [AnimatedContainer, TranslateModule, ParallaxDirective, ButtonModule, TextAnimationDirective, ImageAnimationDirective, CommonModule, CirclePattern],
})
export class HomeHeroComponent {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());

    isWide = computed(() => this.layoutService.isWide());

}
