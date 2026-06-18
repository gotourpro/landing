import { Component } from "@angular/core";
import { AnimatedContainer } from "../../../../components/animatedcontainer";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'app-header-terms-and-conditions',
    standalone: true,
    imports: [
        AnimatedContainer,
        TranslateModule
    ],
    templateUrl: './header.component.html',
})
export class HeaderTermsAndConditionComponent { }