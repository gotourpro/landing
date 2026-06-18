import { Component } from "@angular/core";
import { HomeHeroComponent } from "../home-hero/home-hero.component";
import { HomeDestinationsComponent } from "../home-destinations/home-destinations.component";
import { AnimatedContainer } from "../../../animatedcontainer";
import { FooterComponent } from "../../../footer/footer.component";
import { HomeFeaturedToursComponent } from "../home-featured-tours/home-featured-tours.component";
import { HomeGalleryComponent } from "../home-gallery/home-gallery.component";
import { HometesTimonialsComponent } from "../home-testimonials/home-testimonials.component";
import { HomeOrganizersComponent } from "../home-organizers/home-organizers.component";
import { HomeBlogComponent } from "../home-blog/home-blog.component";
import { HomeWhyChooseComponent } from "../home-why-choose/home-why-choose.component";
import { HomeHowToWorkComponent } from "../home-how-to-work/home-how-to-work.component";
import { DialogDrawerService } from "../../../dialog-panel/dialog-panel.service";
import { DIALOG_PANEL_DATA } from "../../../dialog-panel/dialog-panel.tokens";
import { MenuComponent } from "../../../menu/components/menu.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HomeHeroComponent,
        HomeDestinationsComponent,
        AnimatedContainer,
        FooterComponent,
        HomeFeaturedToursComponent,
        HomeGalleryComponent,
        HometesTimonialsComponent,
        HomeOrganizersComponent,
        HomeBlogComponent,
        HomeWhyChooseComponent,
        HomeHowToWorkComponent,
        MenuComponent

    ],
    providers: [DialogDrawerService, {
        provide: DIALOG_PANEL_DATA,
        useValue: {},
    }],
    templateUrl: './home.component.html',
})
export class HomeComponent { }