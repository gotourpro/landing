
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { RippleModule } from 'primeng/ripple';
import { DialogDrawer } from "../dialog-panel/models/dialog-panel.model";
import { MenuItem } from "primeng/api";
import { MenuService } from "../menu/services/menu.service";
import { AppLogo } from "../UI/app.logo";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-menubar-mobile",
    standalone: true,
    imports: [CommonModule, AppLogo, RouterLink, TranslateModule, DrawerModule, ButtonModule, AvatarModule, RippleModule],
    templateUrl: './menubar-mobile.component.html',
    styleUrls: ['./menubar-mobile.component.scss'],
})
export class MenubarMobileComponent {
    public menuItems: MenuItem[] = [];
    public menuItems$ =
        this.menuService.menuItems$;
    constructor(
        public dialogDrawer: DialogDrawer,
        private menuService: MenuService,
        private _cdr: ChangeDetectorRef,

    ) {

    }
    @Input() visible = true;
    @Output() visibleChange = new EventEmitter<boolean>();

    public ngOnInit(): void { }

    public ngOnDestroy(): void { }

    public close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    public items = [

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
            url: 'mailto:info@gotour.pro?subject=GoTour%20Support'
        },
    ];

}
