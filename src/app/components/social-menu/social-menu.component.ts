import { Component, Input } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { SpeedDial } from 'primeng/speeddial';
import { RouterModule } from '@angular/router';
import { ISocialMenuItem } from './interfaces/social-menu.interface';
import { MaxIcon } from '../icon/max/max.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
    selector: 'app-social-menu',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        RippleModule,
        ButtonModule,
        PopoverModule,
        SpeedDial,
        MaxIcon,
        NgComponentOutlet
    ],
    templateUrl: './social-menu.component.html',
    styleUrls: ['./social-menu.component.scss'],
})
export class SocialMenuComponent {

    @Input() className = 'fixed right-4 bottom-12 cursor-pointer z-[9999999] text-5xl';
    @Input() buttonClassName = 'shadow-[0px_1px_4px_rgba(0,0,0,0.1),0px_2px_12px_rgba(0,0,0,0.2)]';


    public items: ISocialMenuItem[] | null;

    constructor() {
        this.items = [

            {
                icon: 'pi pi-whatsapp',
                target: '_blank',
                url: 'https://wa.me/79629366377?text=%D0%94%D0%BE%D0%B1%D1%80%D1%8B%D0%B9%20%D0%B4%D0%B5%D0%BD%D1%8C%2C%20%D1%8F%20%D0%BF%D0%B8%D1%88%D1%83%20%D0%B2%D0%B0%D0%BC%20%D0%BF%D0%BE%20%D0%BF%D0%BE%D0%B2%D0%BE%D0%B4%D1%83%20%D1%82%D1%83%D1%80%D0%B0%20%D0%B2%20%D0%9A%D0%B8%D1%82%D0%B0%D0%B9%20%D1%81%20%D0%B2%D0%B0%D1%88%D0%B5%D0%B3%D0%BE%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.'
            },
            {
                icon: 'pi pi-telegram',
                target: '_blank',
                url: 'https://t.me/Olo_Boro'
            },
            {
                icon: 'pi pi-phone',
                target: '_blank',
                url: 'tel:+7 (991) 883-33-99'
            },
            {
                icon: 'pi pi-envelope',
                url: 'mailto:info@gotiva.pro?subject=GoTiva%20Support'
            },
            {
                svgIcon: MaxIcon,
                url: 'https://max.ru/u/f9LHodD0cOIpi9sOoKSDHwEI5a3d3cVfupMmR9TXyKWqToj2FId28YjuYEM'
            },
        ];
    }

}