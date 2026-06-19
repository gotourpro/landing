import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import { TranslateModule } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { AnimatedContainer } from "../animatedcontainer";
import { HeaderComponent } from "../header/header.component";
import { MenuComponent } from "../menu/components/menu.component";
import { FooterComponent } from "../footer/footer.component";
import { ILegalDocument } from "../../interfaces/legal-document.interface";
import { LegalContentService } from "../../services/legal.service";
import { LocalizationService } from "../../services/localization.service";
@Component({
    selector: 'app-terms-and-conditions',
    standalone: true,
    imports: [
        CommonModule,
        AnimatedContainer,
        TranslateModule,
        HeaderComponent,
        MenuComponent,
        FooterComponent
    ],
    templateUrl: './terms-and-conditions.component.html',
})
export class TermsAndConditionComponent {

    public terms$!: Observable<ILegalDocument>;

    constructor(
        private readonly legalContent: LegalContentService,
        public localization: LocalizationService
    ) { }

    ngOnInit(): void {

        this.terms$ =
            this.legalContent.getDocument(
                'terms-and-conditions'
            );
    }
}