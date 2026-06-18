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
import { ITestimonial } from "../../../testimonials/interfaces/itestimonial.interface";
import { TestimonialsService } from "../../../testimonials/services/testimonials.service";

@Component({
    selector: "app-home-testimonials",
    standalone: true,
    templateUrl: './home-testimonials.component.html',
    styleUrls: ['./home-testimonials.component.scss'],
    imports: [AnimatedContainer,
        UICarousel,
        UICarouselItem,
        ParallaxDirective,
        TextAnimationDirective,
        ImageAnimationDirective, CommonModule, CirclePattern],
})
export class HometesTimonialsComponent {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());
    isMobile = computed(() => this.layoutService.isMobile());
    isWide = computed(() => this.layoutService.isWide());


    public testimonialsItems: ITestimonial[] = [];

    constructor(
    private testimonialsService: TestimonialsService
) {}

public ngOnInit(): void {
    this.testimonialsService
        .getFeatured()
        .subscribe(items => {
            this.testimonialsItems = items;
        });
}

    // testimonialsItems = [
    //     {
    //         content:
    //             'Travehub work helped us save a significant percentage of our tour plan we are happy with all experiences & all services.',
    //         name: 'Tomas Widdin',
    //         designation: 'Web Developer',
    //     },
    //     {
    //         content:
    //             'Travehub work helped us save a significant percentage of our tour plan we are happy with all experiences & all services.',
    //         name: 'William Jack',
    //         designation: 'Web Designer',
    //     },
    // ];



}
