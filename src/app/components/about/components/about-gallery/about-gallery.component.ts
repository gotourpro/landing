import { Component, computed, inject, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { TextAnimationDirective } from "../../../../directives/text-animation/text-animation.directive";
import { ImageAnimationDirective } from "../../../../directives/image-animation/image-animation.directive";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { ABOUT_GALLERY_COLUMNS } from "../../constants/about-gallery.constants";
import { LocalizationService } from "../../../../services/localization.service";
import { TranslateModule } from "@ngx-translate/core";
import { GalleriaComponent } from "../../../galleria/galleria.component";
import { ImageService } from "../../../../services/image-service";
@Component({
  selector: "app-about-gallery",
  standalone: true,
  templateUrl: './about-gallery.component.html',
  styleUrls: ['./about-gallery.component.scss'],
  imports: [AnimatedContainer, GalleriaComponent, ParallaxDirective, TranslateModule, TextAnimationDirective, ImageAnimationDirective, CommonModule],
})
export class AboutGalleryComponent {

  constructor(
    public localization: LocalizationService,
    public image: ImageService,
  ) { }

  @ViewChild('gallery')
  public galleria: GalleriaComponent;

  layoutService = inject(LayoutService);

  isDarkTheme = computed(() => this.layoutService?.isDarkTheme());


  public galleryColumns = ABOUT_GALLERY_COLUMNS;

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

  public openGallery(item: any): void {

    const images = this.galleryColumns.flatMap(
      column =>
        column.items.map(i =>
          this.image.getImage(i.image, 1600)
        )
    );

    const index = this.galleryColumns
      .flatMap(column => column.items)
      .findIndex(i => i.image === item.image);

    this.galleria.open(images, index);
  }
}
