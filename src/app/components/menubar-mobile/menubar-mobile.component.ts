
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

@Component({
    selector: "app-menubar-mobile",
    standalone: true,
    imports: [CommonModule, RouterLink, DrawerModule, ButtonModule, AvatarModule, RippleModule],
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

    public ngOnDestroy(): void {

    }

    public close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
    }

}
