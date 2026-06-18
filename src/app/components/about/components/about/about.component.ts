import { Component } from "@angular/core";
import { AboutGalleryComponent } from "../about-gallery/about-gallery.component";
import { AboutTeamComponent } from "../about-team/about-team.component";
import { AnimatedContainer } from "../../../animatedcontainer";
import { FooterComponent } from "../../../footer/footer.component";
import { HeaderComponent } from "../../../header/header.component";
import { MenuComponent } from "../../../menu/components/menu.component";
import { TranslateModule } from "@ngx-translate/core";
import { AboutWhyChooseUsComponent } from "../why-choose-us/about-why-choose-us.component";
import { AboutTestimonialsComponent } from "../about-testimonials/about-testimonials.component";

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [
        AboutGalleryComponent,
        AboutTeamComponent,
        AnimatedContainer,
        FooterComponent,
        MenuComponent,
        HeaderComponent,
        TranslateModule,
        AboutWhyChooseUsComponent,
        AboutTestimonialsComponent
    ],
    templateUrl: './about.component.html',
})
export class AboutComponent {
   
}