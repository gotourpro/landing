import { Component, computed, inject, Input, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { RouterModule } from "@angular/router";
import { twMerge } from "tailwind-merge";
import { StyleClassModule } from "primeng/styleclass";
import {
    SelectButtonModule,
} from "primeng/selectbutton";

import { $t } from "@primeng/themes";
import { FormsModule } from "@angular/forms";
import { LayoutService } from "../../services/layout.service";
import { ButtonModule } from 'primeng/button';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Material from '@primeng/themes/material';
import Nora from '@primeng/themes/nora';
import { Noir } from '../../app-theme';
interface ColorType {
    name: string;
    palette: Record<string, string>;
}

const presets = {
    Aura,
    Material,
    Lara,
    Nora
};

@Component({
    selector: "app-configurator",
    standalone: true,
    templateUrl: './configurator.component.html',
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        StyleClassModule,
        SelectButtonModule,
        FormsModule,
    ],

})
export class ConfiguratorComponent {
    @Input() className: any = "";
    public platformId = inject(PLATFORM_ID);
    twMerge = twMerge;

    constructor(
        public layoutService: LayoutService,
    ) {
    }


    public ngOnInit(): void {

        if (isPlatformBrowser(this.platformId)) {
            this.onPresetChange(this.layoutService.config().preset);
        }
    }


    public onPresetChange(event: any): void {
        this.layoutService.config.update((state) => ({ ...state, preset: event }));
        const preset = presets[event];
        $t().preset(preset).preset(Noir).use({ useDefaultOptions: true });
    }

    public isDarkMode = computed(() => this.layoutService.config().darkTheme);

    toggleDarkMode() {
        this.layoutService.config.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

}
