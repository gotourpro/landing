import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { ILegalDocument } from "../../interfaces/legal-document.interface";
import { LegalContentService } from "../../services/legal.service";
import { LocalizationService } from "../../services/localization.service";
import { AnimatedContainer } from "../animatedcontainer";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { MenuComponent } from "../menu/components/menu.component";

@Component({
    selector: 'app-cookie-policy',
    standalone: true,
    imports: [
        CommonModule,
        AnimatedContainer,
        TranslateModule,
        HeaderComponent,
        MenuComponent,
        FooterComponent
    ],
    templateUrl: './cookie-policy.component.html'
})
export class CookiePolicyComponent {

    public cookie$!: Observable<ILegalDocument>;

    constructor(
        private readonly legalContent: LegalContentService,
        public localization: LocalizationService
    ) {}

    ngOnInit(): void {

        this.cookie$ =
            this.legalContent.getDocument(
                'cookie-policy'
            );
    }
}