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
@Component({
  selector: "app-home-gallery",
  standalone: true,
  templateUrl: './home-gallery.component.html',
  styleUrls: ['./home-gallery.component.scss'],
  imports: [AnimatedContainer, ParallaxDirective, UICarousel, UICarouselItem, TextAnimationDirective, ImageAnimationDirective, CommonModule, CirclePattern],
})
export class HomeGalleryComponent {
  layoutService = inject(LayoutService);
  isMobile = computed(() => this.layoutService.isMobile());
  isDarkTheme = computed(() => this.layoutService?.isDarkTheme());

  isWide = computed(() => this.layoutService.isWide());

  galleryColumns = [
    {
      type: 'large',
      items: [
        {
          image: 'assets/images/gallery/gallery-1-1.jpg'
        }
      ]
    },
    {
      type: 'small',
      items: [
        {
          image: 'assets/images/gallery/gallery-1-2.jpg'
        },
        {
          image: 'assets/images/gallery/gallery-1-6.jpg'
        }
      ]
    },
    {
      type: 'large',
      items: [
        {
          image: 'assets/images/gallery/gallery-1-3.jpg'
        }
      ]
    },
    {
      type: 'small',
      items: [
        {
          image: 'assets/images/gallery/gallery-1-4.jpg'
        },
        {
          image: 'assets/images/gallery/gallery-1-7.jpg'
        }
      ]
    },
    {
      type: 'large',
      items: [
        {
          image: 'assets/images/gallery/gallery-1-5.jpg'
        }
      ]
    }
  ];

  getGalleryColumnClass(span: number): string {
    switch (span) {
      case 2:
        return 'col-span-12 lg:col-span-2';

      case 3:
        return 'col-span-12 lg:col-span-3';

      case 4:
        return 'col-span-12 lg:col-span-4';

      default:
        return 'col-span-12';
    }
  }


  galleryItems = [
    {
      title: 'New York',
      image: 'assets/images/gallery/gallery-2-1.jpg'
    },
    {
      title: 'New York',
      image: 'assets/images/gallery/gallery-2-2.jpg'
    },
    {
      title: 'New York',
      image: 'assets/images/gallery/gallery-2-3.jpg'
    },
    {
      title: 'New York',
      image: 'assets/images/gallery/gallery-2-4.jpg'
    },
    // {
    //   title: 'New York',
    //   image: 'assets/images/gallery/gallery-2-5.jpg'
    // }
  ];
}
