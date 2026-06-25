import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AnimatedContainer } from "../animatedcontainer";
import { AppLogo } from "../UI/app.logo";
import { FooterLink } from "./interfaces/footer-link.interface";
import { FooterSocial } from "./interfaces/footer-sosial.interface";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: "app-footer",
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [
        CommonModule,
        AnimatedContainer,
        AppLogo,
        RouterLink,
        TranslateModule
    ],
})
export class FooterComponent implements OnInit {

    @Input() noContainer?: boolean;
    @Input() className?: string;
    @Input() image?: string;
    @Input() transparent?: boolean;

    public currentYear =
        new Date().getFullYear();

    public aboutText = '';

    public usefulLinks: FooterLink[] = [];

    public serviceLinks: FooterLink[] = [];

    public legalLinks: FooterLink[] = [];

    public socials: FooterSocial[] = [
        {
            icon: 'pi pi-telegram',
            href: 'https://t.me/Olo_Boro'
        },
        {
            icon: 'pi pi-whatsapp',
            href: 'https://wa.me/79629366377?text=Hello'
        },
        {
            icon: 'pi pi-phone',
            href: 'tel:+79918833399'
        },
        {
            icon: 'pi pi-envelope',
            href: 'mailto:info@gotour.pro?subject=GoTour%20Support'
        }
    ];

    constructor(
        private translate: TranslateService
    ) { }

    public ngOnInit(): void {
        this.loadTranslations();

        this.translate.onLangChange
            .subscribe(() => this.loadTranslations());
    }

    private loadTranslations(): void {

        this.translate.get([
            'components.footer.about',
            'components.footer.usefulLinks',
            'components.footer.services',
            'components.footer.legal',

            'components.footer.destination',
            'components.footer.blog',
            'components.footer.faq',
            'components.footer.contact',
            'components.footer.aboutUs',

            'components.footer.educationalTours',
            'components.footer.tourPackages',

            'components.footer.womenBeautyTours',
            'components.footer.menWellnessTours',
            'components.footer.airportTransfer',

            'components.footer.privacyPolicy',
            'components.footer.termsConditions'
        ]).subscribe(t => {

            this.aboutText =
                t['components.footer.about'];

            this.usefulLinks = [
                {
                    label: t['components.footer.destination'],
                    route: '/destinations'
                },
                {
                    label: t['components.footer.blog'],
                    route: '/blog'
                },
                {
                    label: t['components.footer.faq'],
                    route: '/faq'
                },
                {
                    label: t['components.footer.contact'],
                    route: '/contact'
                },
                {
                    label: t['components.footer.aboutUs'],
                    route: '/about'
                }
            ];

            this.serviceLinks = [
                {
                    label: t['components.footer.tourPackages'],
                    route: '/tours'
                },
                {
                    label: t['components.footer.womenBeautyTours'],
                    route: '/tours/category/women-beauty'
                },
                {
                    label: t['components.footer.menWellnessTours'],
                    route: '/tours/category/men-wellness'
                },
                {
                    label: t['components.footer.airportTransfer'],
                    route: '/blog/airport-meet-and-greet-china'
                }
            ];

            this.legalLinks = [
                {
                    label: t['components.footer.privacyPolicy']
                },
                {
                    label: t['components.footer.termsConditions']
                }
            ];
        });
    }
}
