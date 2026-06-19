import { ChangeDetectorRef, Component, computed, inject } from "@angular/core";
import { AnimatedContainer } from "../../../animatedcontainer";
import { FooterComponent } from "../../../footer/footer.component";
import { HeaderComponent } from "../../../header/header.component";
import { MenuComponent } from "../../../menu/components/menu.component";
import { BehaviorSubject, debounceTime, map, Observable, Subject, takeUntil, timer } from "rxjs";
import { GoogleMapsModule, MapAdvancedMarker } from "@angular/google-maps";
import { GoogleMapsLoaderService } from "../../../../services/google-maps-loader.service";
import { Feature, Point } from "geojson";
import { point } from "@turf/helpers";
import { LayoutService } from "../../../../services/layout.service";
import { CommonModule } from "@angular/common";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FieldValidationDirective } from "../../../../directives/field-validation";
import { ContactService } from "../../services/contact.service";
import { MessageModule } from 'primeng/message';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from "../../../../services/localization.service";
@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [
        CommonModule,
        AnimatedContainer,
        MenuComponent,
        HeaderComponent,
        FooterComponent,
        GoogleMapsModule,
        MapAdvancedMarker,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        FieldValidationDirective,
        MessageModule
    ],
    templateUrl: './contact.component.html',
    styleUrl: 'contact.component.scss'
})
export class ContactComponent {

    public form: FormGroup;
    public markers: any[] = [];
    public sending = false;
    public submitSuccess = false;
    public submitError = false;
    public success = false;
    public layoutService = inject(LayoutService);
    public isDarkTheme = computed(() => this.layoutService.isDarkTheme());
    public errorMessages: Record<
        string,
        string | ((error: any) => string)
    > = {};
    public _destroy$ = new Subject<void>();
    private _showMapSubject = new BehaviorSubject<boolean>(false);
    public showMap$: Observable<boolean> = this._showMapSubject.asObservable();
    public mapOptions: google.maps.MapOptions = {
        center: { lat: 55.74218032609179, lng: 37.62001671463327 },
        zoom: 16,
        disableDefaultUI: true,
        minZoom: 3,
        mapId: 'a870aaade7ac6f22',
        styles: [
            {
                "featureType": "landscape.natural.landcover",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#1bbc9b"
                    }
                ]
            }
        ]

        ,
        gestureHandling: 'greedy',
        scrollwheel: true,
        colorScheme: this.layoutService.config().darkTheme ? 'DARK' : 'LIGHT',
        clickableIcons: false
    };

    constructor(
        private _cdr: ChangeDetectorRef,
        private _googleMapsLoader: GoogleMapsLoaderService,
        private _fb: FormBuilder,
        private contactService: ContactService,
        private translate: TranslateService,
        public localization: LocalizationService,
    ) {
        this.buildForm();
        this._watchForMapAPILoadChanges();

    }

    private _watchForMapAPILoadChanges(): void {
        this._googleMapsLoader.apiLoaded$
            .pipe(
                debounceTime(0),
                takeUntil(this._destroy$)
            )
            .subscribe(() => {
                this._showMapSubject.next(false);
                timer(0)
                    .pipe(takeUntil(this._destroy$))
                    .subscribe(() => {
                        this._showMapSubject.next(true);
                        const pointCoord = [37.62001671463327, 55.74218032609179] as [number, number];
                        const marker = this.buildMarker(point(pointCoord, { name: 'Ankara Avenue, 405 ' }) as any, 'A', '#E94435');
                        this.markers.push(marker);
                        this._cdr.markForCheck();
                    });
            });
    }

    public ngOnInit(): void {
        this.errorMessages = {
            minlength: (error: any) =>
                this.translate.instant(
                    'components.contact.validation.minlength',
                    {
                        length: error.requiredLength
                    }
                ),

            pattern: () =>
                this.translate.instant(
                    'components.contact.validation.invalidEmail'
                ),

            required: () =>
                this.translate.instant(
                    'components.contact.validation.required'
                )
        };


        this.localization.languageChanged$
            .pipe(
                map(event => event.lang),
                takeUntil(this._destroy$)
            )
            .subscribe(lang => {

                this._googleMapsLoader
                    .reloadWithNewLanguage(lang);

            });
    }

    public onSubmit(): void {

        if (this.form.invalid || this.sending) {
            return;
        }

        this.submitSuccess = false;
        this.submitError = false;

        this.sending = true;

        this.contactService
            .send(this.form.getRawValue())
            .subscribe({
                next: () => {

                    this.submitSuccess = true;

                    this.form.reset();

                    this.sending = false;
                },
                error: () => {

                    this.submitError = true;

                    this.sending = false;
                }
            });
    }

    public buildForm(): void {
        this.form = this._fb.group({
            name: new FormControl(null, [Validators.required]),
            message: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
                Validators.email
            ]),
        });
    }

    public trackBy(index: number, m: any): string {
        return m.label;
    }
    private buildMarker(
        feature: Feature<Point>,
        label: string,
        color: string
    ): any {

        const [lng, lat] = feature.geometry.coordinates;

        return {
            feature,
            label,
            position: { lat, lng },
            content: this.createMarkerContent(
                'assets/images/maps/destination.svg'
            )
        };
    }
    private createMarkerContent(svgPath: string): HTMLElement {

        const img = document.createElement('img');

        img.src = svgPath;
        img.alt = 'Marker';

        Object.assign(img.style, {
            width: '44px',
            height: '44px',
            display: 'block',
            pointerEvents: 'auto'
        });

        return img;
    }

}