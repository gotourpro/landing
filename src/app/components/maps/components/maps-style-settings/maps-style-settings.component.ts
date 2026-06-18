import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsConfigService } from '../../../../services/google-maps-config.service';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'app-maps-style-settings',
    templateUrl: './maps-style-settings.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ColorPickerModule,
        InputNumberModule
    ]
})
export class MapsStyleSettingsComponent implements OnInit {
    @Input() initialStyle: google.maps.Data.StyleOptions | null = null;

    public form!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private configService: GoogleMapsConfigService

    ) {
        this._buildForm();
    }

    public ngOnInit(): void {
        this._watchForFormChanges();
    }

    private _watchForFormChanges(): void {
        this.form.valueChanges
            .subscribe(value => {
                this.configService.update({ style: value });
            });
    }

    private _buildForm(): void {

        this.form = this.fb.group({
            strokeColor: [this.configService.getStyle().strokeColor || this.initialStyle?.strokeColor || '#424F7D'],
            strokeOpacity: [this.initialStyle?.strokeOpacity ?? 1],
            strokeWeight: [this.initialStyle?.strokeWeight ?? 3],
            fillColor: [this.configService.getStyle().fillColor || this.initialStyle?.fillColor || '#424F7D'],
            fillOpacity: [this.initialStyle?.fillOpacity ?? 0.4]
        });
    }

    get styleValue(): google.maps.Data.StyleOptions {
        return this.form.value as google.maps.Data.StyleOptions;
    }
}
