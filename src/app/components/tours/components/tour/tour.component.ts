
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AnimatedContainer } from "../../../../components/animatedcontainer";
import { HeaderComponent } from "../../../header/header.component";
import { FooterComponent } from "../../../footer/footer.component";
import { MenuComponent } from "../../../menu/components/menu.component";
@Component({
    selector: "app-tour",
    standalone: true,
    imports: [HeaderComponent, MenuComponent, AnimatedContainer, FooterComponent],
    templateUrl: './tour.component.html',
})
export class TourComponent {

    constructor(private router: Router) { }

    public title = 'Tour List';
    public description = ''

}
