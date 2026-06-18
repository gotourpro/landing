import { Component } from "@angular/core";
import { AnimatedContainer } from "../../components/animatedcontainer";
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderTermsAndConditionComponent } from "./components/header/header.component";


@Component({
    selector: 'app-page-terms-and-conditions',
    standalone: true,
    imports: [
        HeaderTermsAndConditionComponent,
        AnimatedContainer,
        FooterComponent,
    ],
    templateUrl: './index.html',
})
export class TermsAndConditionsPageComponent { }