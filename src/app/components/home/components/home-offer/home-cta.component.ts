import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { TextAnimationDirective } from "../../../../directives/text-animation/text-animation.directive";
import { ImageAnimationDirective } from "../../../../directives/image-animation/image-animation.directive";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-home-cta",
    standalone: true,
    templateUrl: './home-cta.component.html',
    styleUrls: ['./home-cta.component.scss'],
    imports: [AnimatedContainer, TranslateModule, ParallaxDirective, ButtonModule, TextAnimationDirective, ImageAnimationDirective, CommonModule, RouterLink],
})
export class HomeCtaComponent {
    layoutService = inject(LayoutService);
    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());
    isWide = computed(() => this.layoutService.isWide());

}
