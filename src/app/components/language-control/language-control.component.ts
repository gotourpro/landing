import { Component, computed, inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Language } from '../../constants/languages.constants';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { LocalizationService } from '../../services/localization.service';
import { LayoutService } from '../../services/layout.service';

@Component({
    selector: 'app-language-control',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ListboxModule,
        RippleModule,
        ButtonModule,
        PopoverModule,
    ],
    templateUrl: './language-control.component.html',
    styleUrls: ['./language-control.component.scss'],
})
export class LanguageControlComponent {
    @ViewChild('popover', { static: true }) popover!: any;
    @Input() panelStyle: { [key: string]: any } = {};
    @Input() panelStyleClass = 'mt-8 p-0';
    @Input() styleClass = 'text-primary dark:text-white';

    public languages: any = Language;
    public selected: any = this.languages[0];
    public layoutService = inject(LayoutService);
    public isMobile = computed(() => this.layoutService.isMobile());

    constructor(
        private localization: LocalizationService,
    ) {
        const savedLang = localStorage.getItem('app_language') || 'ru';
        this.selected = this.languages.find((l: any) => l.code === savedLang) || this.languages[0];
    }

    public onChange(event: any): void {
        const lang = event.value;
        this.popover?.hide();
        if (!lang || lang.code === this.selected.code) {
            return;
        }
        this.localization.setLanguage(lang.code);
        this.selected = lang;
    }

}