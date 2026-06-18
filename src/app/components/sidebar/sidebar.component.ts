import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DateTimeComponent } from '../date-time/date-time.component';
import { Subject, tap } from 'rxjs';
import { DialogDrawerService } from '../dialog-panel/dialog-panel.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-sidebar',
    imports: [
        CommonModule,
        ButtonModule,
        RouterModule,
        AvatarModule,
        DateTimeComponent
    ],
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

    @Output() public clickUser: Subject<any> = new Subject<any>();

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @Output() public changed: EventEmitter<any> = new EventEmitter<any>();

    public timeout: any = null;

    public userName: string | undefined;

    public avatarImage: any = null;

    constructor(
        public layoutService: LayoutService,
        private _dialogDrawerService: DialogDrawerService,
        private _userService: UserService,
        public el: ElementRef,
        public renderer: Renderer2,
    ) {
        this._userService.getUser()
            .pipe(
                tap((data) => this.userName = data?.username || data?.firstName)
            )
            .subscribe()
    }

    public ngOnDestroy(): void { }

    public onMenuButtonClick(): void {
        this.layoutService.onMenuToggle();
    }

    public onClickUser(): void {
    }

    public onMouseEnter(): void {
        if (!this.layoutService.state.anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.layoutService.state.sidebarActive = true;
        }
    }

    public onMouseLeave(): void {
        if (!this.layoutService.state.anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => this.layoutService.state.sidebarActive = false, 300);
            }
        }
    }

    public anchor(): void {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
    }

}
