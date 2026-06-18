import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { CirclePattern } from "../../../circlepattern";
import { LayoutService } from "../../../../services/layout.service";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { GridCardComponent } from "../../../grid-card/grid-card.component";
import { twMerge } from "tailwind-merge";
@Component({
    selector: "app-home-featured-tours",
    standalone: true,
    templateUrl: './home-featured-tours.component.html',
    styleUrls: ['./home-featured-tours.component.scss'],
    imports: [CommonModule, AnimatedContainer, GridCardComponent, ParallaxDirective, CirclePattern],
})
export class HomeFeaturedToursComponent {
    layoutService = inject(LayoutService);
    public twMerge = twMerge;
    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());
    isMobile = computed(() => this.layoutService.isMobile());
    isWide = computed(() => this.layoutService.isWide());

    public getDelay(index: number): number {
        return index * 100;
    }


    public tours = [
        {
            title: 'Over Rome Waves',
            slug: 'over-turkish-waves',
            image: 'assets/images/tours/424x292.svg',
            price: 385,
            rating: 5.0,
            reviews: 245,
            description: '6 Days',
            location: 'US, Alaska',
            discount: '40% off',
            video: 'https://www.youtube.com/watch?v=G49_MdP0klg'
        },
        {
            title: 'Over Rome Waves',
            slug: 'over-rome-waves',
            image: 'assets/images/tours/424x292.svg',
            price: 395,
            rating: 5.0,
            description: '6 Days',
            reviews: 245,
            location: 'Rome',
            discount: '60% off',
            video: 'https://www.youtube.com/watch?v=G49_MdP0klg'
        },
        {
            title: 'Over Rome Waves',
            slug: 'over-turkish-waves',
            image: 'assets/images/tours/424x292.svg',
            price: 385,
            description: '6 Days',
            rating: 5.0,
            reviews: 245,
            location: 'US, Alaska',
            discount: '40% off',
            video: 'https://www.youtube.com/watch?v=G49_MdP0klg'
        },
        {
            title: 'Over Rome Waves',
            slug: 'over-turkish-waves',
            image: 'assets/images/tours/424x292.svg',
            price: 385,
            description: '6 Days',
            rating: 5.0,
            reviews: 245,
            location: 'US, Alaska',
            discount: '40% off',
            video: 'https://www.youtube.com/watch?v=G49_MdP0klg'
        },
        {
            title: 'Over Rome Waves',
            slug: 'over-turkish-waves',
            image: 'assets/images/tours/424x292.svg',
            price: 385,
            description: '6 Days',
            rating: 5.0,
            reviews: 245,
            location: 'US, Alaska',
            discount: '40% off',
            video: 'https://www.youtube.com/watch?v=G49_MdP0klg'
        },
        {
            title: 'Over Rome Waves',
            slug: 'over-turkish-waves',
            image: 'assets/images/tours/424x292.svg',
            price: 385,
            description: '6 Days',
            rating: 5.0,
            reviews: 245,
            location: 'US, Alaska',
            discount: '40% off',
            video: 'https://www.youtube.com/watch?v=G49_MdP0klg'
        }

    ];



    public getTourGridClass(index: number): string {
        const classes = [
            'mb-6 xl:absolute xl:top-0 xl:left-0 xl:w-[370px] xl:h-[430px]',
            'mb-6 xl:absolute xl:top-0 xl:left-[391px] xl:w-[761px] xl:h-[260px]',
            'mb-6 xl:absolute xl:top-[281px] xl:left-[782px] xl:w-[370px] xl:h-[280px]',
            'mb-6 xl:absolute xl:top-[281px] xl:left-[391px] xl:w-[370px] xl:h-[520px]',
            'mb-6 xl:absolute xl:top-[451px] xl:left-0 xl:w-[370px] xl:h-[350px]',
            'mb-6 xl:absolute xl:top-[582px] xl:left-[782px] xl:w-[370px] xl:h-[219px]',
        ];

        return classes[index] ?? '';
    }

}
