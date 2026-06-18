import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { CirclePattern } from "../../../circlepattern";
import { LayoutService } from "../../../../services/layout.service";
import { TextAnimationDirective } from "../../../../directives/text-animation/text-animation.directive";
import { ImageAnimationDirective } from "../../../../directives/image-animation/image-animation.directive";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { UICarousel } from "../../../UI/carousel";
import { UICarouselItem } from "../../../UI/carousel-item";
import { BlogService } from "../../../blog/services/blog.service";
import { LocalizationService } from "../../../../services/localization.service";
import { IBlogPost } from "../../../blog/interfaces/blog-post.interface";
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";
@Component({
    selector: "app-home-blog",
    standalone: true,
    templateUrl: './home-blog.component.html',
    styleUrls: ['./home-blog.component.scss'],
    imports: [AnimatedContainer, RouterLink, ParallaxDirective, UICarousel, UICarouselItem, TextAnimationDirective, ImageAnimationDirective, CommonModule, TranslateModule],
})
export class HomeBlogComponent {

    constructor(
        private blogService: BlogService,
        public localization: LocalizationService
    ) { }

    public blogItems: IBlogPost[] = [];
    public layoutService = inject(LayoutService);
    public isMobile = computed(() => this.layoutService.isMobile());
    public isDarkTheme = computed(() => this.layoutService?.isDarkTheme());

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
    }

    public ngOnInit(): void {
        this.blogService
            .getFeatured()
            .subscribe(posts => {
                this.blogItems = posts.slice(0, 6);
            });
    }
}
