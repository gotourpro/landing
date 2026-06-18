import { ChangeDetectorRef, Directive } from "@angular/core";
import { Menubar, MenubarSub } from "primeng/menubar";
import { resolve } from '@primeuix/utils';
@Directive({
    selector: '[keepOpenMegaMenu]'
})
export class KeepOpenMegaMenuDirective {
    constructor(menu: Menubar, private cd: ChangeDetectorRef) {
        const m = menu as any;

        m.bindOutsideClickListener = () => { };
        m.unbindOutsideClickListener = () => { };

        m.hide = (_event?: any, _isFocus?: boolean) => {
            this.cd.markForCheck();
        };

        (MenubarSub.prototype as any).onItemClick = function (event: any, processedItem: any) {
            if (processedItem.command) {
                resolve(processedItem.command, {
                    originalEvent: event.originalEvent,
                    item: processedItem
                });
            }
        };
    }
}