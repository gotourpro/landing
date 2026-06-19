import { AfterViewInit, Component, HostListener, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { LanguageControlComponent } from '../language-control/language-control.component';
import { MenubarModule } from 'primeng/menubar';
import { TranslateModule } from '@ngx-translate/core';
import { twMerge } from 'tailwind-merge';
import { KeepOpenMegaMenuDirective } from '../menu/directives/keep-menu.directive';
import { MegaMenuMaskDirective } from '../menu/directives/mask-menu.directive';
import { MenuComponent } from '../menu/components/menu.component';

@Component({
    selector: 'app-menubar',
    templateUrl: './menubar.component.html',
    styleUrls: ['./menubar.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Menubar,
        SelectModule,
        ButtonModule,
        RouterModule,
        AvatarModule,
        LanguageControlComponent,
        KeepOpenMegaMenuDirective,
        MegaMenuMaskDirective,
        TranslateModule,
        MenubarModule,
        MenuComponent
    ]
})
export class MenuBarComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() containerStyleClass: string = '';
    @Input() sybContainerStyleClass: string = '';
    @Input() styleClass: string = '';
    @Input() logoStyleClass: string = 'fill-primary dark:fill-primary';
    @Input() logoTextStyleClass: string = 'fill-[#505A7C] dark:fill-[#505A7C]';
    @Input() styleClassColor: string = '';
    @Input() styleStickyClassColor: string = '';
    @Input() styleStickyActiveClassColor: string = '';
    @Input() styleClassEnd: string = 'text-primary dark:text-white';
    @Input() topOffset = 0;
    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        this.isSticky = window.scrollY > 70;
        if (this.isSticky) {
            this.styleClassColor = this.styleStickyActiveClassColor;
            this.styleClassEnd = this.styleStickyActiveClassColor
        }
        else {
            this.styleClassColor = this.styleStickyClassColor
            this.styleClassEnd = this.styleStickyClassColor
        }
    }
    public isSticky = false;
    public twMerge = twMerge;

    private destroy$ = new Subject<void>();
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {

    }
    public scrollListener: VoidFunction | null;
    public ngOnInit() { }

    public ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}