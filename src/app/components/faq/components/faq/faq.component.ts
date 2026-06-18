import { Component } from "@angular/core";
import { AnimatedContainer } from "../../../animatedcontainer";
import { FooterComponent } from "../../../footer/footer.component";
import { HeaderComponent } from "../../../header/header.component";
import { MenuComponent } from "../../../menu/components/menu.component";
import { LocalizationService } from "../../../../services/localization.service";
import { FaqItem } from "../../interfaces/faq-item.interface";
import { faqData } from "../../constants/faq-data.constant";
import { AccordionModule } from "primeng/accordion";
import { CommonModule } from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [
        CommonModule,
        AnimatedContainer,
        FooterComponent,
        AccordionModule,
        MenuComponent,
        HeaderComponent,
        TranslateModule
    ],
    templateUrl: './faq.component.html',
})
export class FaqComponent {
    constructor(
        public localization: LocalizationService
    ) { }

    public faqData: FaqItem[] = faqData;

    public title = 'Frequently Asked Questions';
    public description = 'We’re here to assist you with any questions or concerns—reach out to our dedicated support team anytime.'

}