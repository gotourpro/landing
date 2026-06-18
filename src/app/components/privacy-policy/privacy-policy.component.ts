import { Component } from "@angular/core";
import { AnimatedContainer } from "../animatedcontainer";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [
        CommonModule,
        AnimatedContainer,
        TranslateModule,

    ],
    templateUrl: './privacy-policy.component.html',
})
export class PrivacyPolicyComponent {

    constructor(private translate: TranslateService) { }
}