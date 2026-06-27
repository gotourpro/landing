import { ChangeDetectorRef, Component, computed, inject, ViewChild } from "@angular/core";
import { AnimatedContainer } from "../../../animatedcontainer";
import { MenuComponent } from "../../../menu/components/menu.component";
import { HeaderComponent } from "../../../header/header.component";
import { FooterComponent } from "../../../footer/footer.component";
import { ActivatedRoute } from "@angular/router";
import { ToursService } from "../../services/tours.service";
import { LocalizationService } from "../../../../services/localization.service";
import { GoogleMapsLoaderService } from "../../../../services/google-maps-loader.service";
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker } from "@angular/google-maps";
import { Feature, Point } from "geojson";
import { BehaviorSubject, debounceTime, map, Observable, Subject, takeUntil, timer } from "rxjs";
import { point } from "@turf/helpers";
import { CommonModule } from "@angular/common";
import { GalleriaComponent } from "../../../galleria/galleria.component";
import { LayoutService } from "../../../../services/layout.service";
import { AccordionModule } from "primeng/accordion";
import { TranslateModule } from "@ngx-translate/core";
import { SeoService } from "../../../../services/seo.service";
import { ITourLocation } from "../../../../interfaces/location.interface";
import { ImageService } from "../../../../services/image-service";
@Component({
    selector: "app-tour-details",
    standalone: true,
    templateUrl: './tour-details.component.html',
    styleUrls: ['./tour-details.component.scss'],
    imports: [
        CommonModule,
        AnimatedContainer,
        MenuComponent,
        HeaderComponent,
        FooterComponent,
        GoogleMapsModule,
        MapAdvancedMarker,
        GalleriaComponent,
        AccordionModule,
        TranslateModule
    ],
})
export class TourDetailsComponent {

    public map!: any;
    @ViewChild(GalleriaComponent)
    public galleria!: GalleriaComponent;
    public tour: any = null;
    public title = '';
    public description = '';
    public galleryColumns: {
        images: {
            image: string;
            height: number;
        }[];
    }[] = [];

    public markers: any[] = [];
    locations?: ITourLocation[];
    public _destroy$ = new Subject<void>();
    private _showMapSubject = new BehaviorSubject<boolean>(false);
    public layoutService = inject(LayoutService);
    public isDarkTheme = computed(() => this.layoutService.isDarkTheme());
    public showMap$: Observable<boolean> = this._showMapSubject.asObservable();
    public mapOptions: google.maps.MapOptions = {
        center: { lat: 55.74218032609179, lng: 37.62001671463327 },
        zoom: 16,
        disableDefaultUI: true,
        minZoom: 3,
        mapId: 'a870aaade7ac6f22',
        styles: [],
        colorScheme: this.isDarkTheme() ? 'DARK' : 'LIGHT',
        gestureHandling: 'greedy',
        scrollwheel: true,
        clickableIcons: false
    };

    constructor(
        private route: ActivatedRoute,
        private toursService: ToursService,
        public localization: LocalizationService,
        private _googleMapsLoader: GoogleMapsLoaderService,
        private seoService: SeoService,
        private _cdr: ChangeDetectorRef,
        public image: ImageService,
    ) { }

    public ngOnInit(): void {

        const slug =
            this.route.snapshot.paramMap.get('slug');

        if (!slug) {
            return;
        }

        this.toursService
            .getBySlug(slug)
            .subscribe(tour => {

                if (!tour) {
                    return;
                }

                this.tour = tour;
                this.title =
                    this.localization.getText(
                        this.tour.titleHeader ??
                        this.tour.title
                    );

                this.description =
                    this.localization.getText(
                        this.tour.tourHeader ??
                        this.tour.description
                    );

                this.updateLocalizedContent();
                this.onInit();

            });



        this.localization.languageChanged$
            .pipe(
                map(event => event.lang),
                takeUntil(this._destroy$)
            )
            .subscribe(lang => {

                this._googleMapsLoader
                    .reloadWithNewLanguage(lang);

                if (this.tour) {
                    this.updateLocalizedContent();
                }

            });


        this._watchForMapAPILoadChanges();
    }


    public onInit(): void {

        if (!this.tour) {
            return;
        }

        const images =
            this.tour.images?.length
                ? this.tour.images
                : [this.tour.image];

        this.galleryColumns = [
            {
                images: [
                    {
                        image: images[0] ?? this.tour.image,
                        height: 223
                    },
                    {
                        image: images[1] ?? images[0] ?? this.tour.image,
                        height: 221
                    }
                ]
            },
            {
                images: [
                    {
                        image: images[2] ?? images[0] ?? this.tour.image,
                        height: 461
                    }
                ]
            },
            {
                images: [
                    {
                        image: images[3] ?? images[0] ?? this.tour.image,
                        height: 461
                    }
                ]
            },
            {
                images: [
                    {
                        image: images[4] ?? images[0] ?? this.tour.image,
                        height: 223
                    },
                    {
                        image: images[5] ?? images[0] ?? this.tour.image,
                        height: 223
                    }
                ]
            }
        ];


        if (!this.tour.coordinates?.length) {
            return;
        }

        const [lng, lat] = this.tour.coordinates;

        this.mapOptions = {
            ...this.mapOptions,
            center: { lat, lng }
        };

        this.markers = [];
        const marker = this.buildMarker(point(this.tour?.coordinates as any, { name: ' ' }) as any, '', '');
        this.markers.push(marker);

        if (this.tour.locations?.length) {

            const locationMarkers =
                this.tour.locations
                    .filter(location => location.coordinates?.length)
                    .map(location =>
                        this.buildLocationMarker(
                            point(location.coordinates as any, {
                                name: this.localization.getText(location.name)
                            }) as any
                        )
                    );

            this.markers.push(...locationMarkers);
            this._cdr.detectChanges();
        }


    }

    public ngOnDestroy(): void {
        this.markers = [];
        this.tour = null;
        this._destroy$.next();
        this._destroy$.complete();
    }

    public onMapInitialized(
        map: google.maps.Map
    ): void {

        this.map = map;
        this.fitBounds();
    }


    private updateSeo(): void {

        if (!this.tour) {
            return;
        }

        this.seoService.update({

            title: this.localization.getText(
                this.tour.seo?.title ??
                this.tour.titleHeader ??
                this.tour.title
            ),

            description: this.localization.getText(
                this.tour.seo?.description ??
                this.tour.tourHeader ??
                this.tour.description
            ),

            keywords: this.tour.seo?.keywords
                ? this.localization.getText(
                    this.tour.seo.keywords
                )
                : undefined,

            image:
                this.tour.seo?.image ??
                this.tour.image,

            type:
                this.tour.seo?.type ??
                'article',

            url: window.location.href,

            lang:
                this.localization.getCurrentLanguage(),

        });

    }

    private fitBounds(): void {

        if (!this.map || !this.markers.length) {
            return;
        }

        if (this.markers.length === 1) {

            this.map.setCenter(
                this.markers[0].position
            );

            this.map.setZoom(12);

            return;
        }

        const bounds =
            new google.maps.LatLngBounds();

        this.markers.forEach(marker => {

            bounds.extend(
                marker.position
            );

        });

        this.map.fitBounds(
            bounds,
            {
                top: 80,
                right: 80,
                bottom: 80,
                left: 80
            }
        );

    }


    private buildLocationMarker(
        feature: Feature<Point>
    ): any {

        const [lng, lat] =
            feature.geometry.coordinates;

        return {
            feature,
            position: { lat, lng },
            content: this.createCircleMarkerContent()
        };
    }


    private createCircleMarkerContent(): HTMLElement {

        const el =
            document.createElement('div');

        Object.assign(el.style, {
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#F8931F',
            border: '4px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,.25)'
        });

        return el;
    }


    private updateLocalizedContent(): void {

        if (!this.tour) {
            return;
        }

        this.title =
            this.localization.getText(
                this.tour.titleHeader ??
                this.tour.title
            );

        this.description =
            this.localization.getText(
                this.tour.tourHeader ??
                this.tour.description
            );

        this.updateSeo();
    }

    public openGallery(
        selectedImage: string
    ): void {

        const images = this.galleryImages;

        const activeIndex =
            images.findIndex(
                image => image === selectedImage
            );

        this.galleria.open(
            images,
            activeIndex >= 0 ? activeIndex : 0
        );
    }

    public get galleryImages(): string[] {

        if (!this.tour) {
            return [];
        }

        const images = this.tour.images?.length
            ? this.tour.images
            : [this.tour.image];

        return images.map(image =>
            this.image.getImage(image, 1600)
        );
    }

    public trackBy(index: number, m: any): string {
        return m.label;
    }

    public getGallerySpan(span: number): string {
        return `xl:col-span-${span}`;
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
                    });
            });
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