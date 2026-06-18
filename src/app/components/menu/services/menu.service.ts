import { Injectable } from "@angular/core";
import { MenuItem } from "primeng/api";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private readonly _menuItems =
        new BehaviorSubject<MenuItem[]>([]);

    readonly menuItems$ =
        this._menuItems.asObservable();

    setMenu(items: MenuItem[]): void {
        this._menuItems.next(items);
    }

    get menuItems(): MenuItem[] {
        return this._menuItems.value;
    }
}