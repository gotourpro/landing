import { ChangeDetectorRef, Component, computed, inject, Input, ViewChild } from "@angular/core";
import { FooterComponent } from "../../../../../footer/footer.component";
import { MenuComponent } from "../../../../../menu/components/menu.component";
import { HeaderComponent } from "../../../../../header/header.component";
import { AnimatedContainer } from "../../../../../animatedcontainer";
import { IDestination } from "../../../../interfaces/destination.interface";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DestinationsService } from "../../../../services/destinations.service";
import { GoogleMapsLoaderService } from "../../../../../../services/google-maps-loader.service";
import { BehaviorSubject, debounceTime, map, Observable, Subject, takeUntil, timer } from "rxjs";
import { LocalizationService } from "../../../../../../services/localization.service";
import { GoogleMapsModule, MapAdvancedMarker } from "@angular/google-maps";
import { CommonModule } from "@angular/common";
import { Feature, Point } from "geojson";
import { point } from "@turf/helpers";
import { GalleriaComponent } from "../../../../../galleria/galleria.component";
import { LayoutService } from "../../../../../../services/layout.service";
import { AccordionModule } from "primeng/accordion";
import { TranslateModule } from "@ngx-translate/core";
import { SeoService } from "../../../../../../services/seo.service";
import { ITour } from "../../../../../tours/interfaces/tour.interface";
import { ToursService } from "../../../../../tours/services/tours.service";
import { UICarousel } from "../../../../../UI/carousel";
import { UICarouselItem } from "../../../../../UI/carousel-item";
import { ImageService } from "../../../../../../services/image-service";
@Component({
    selector: "app-destination-details",
    standalone: true,
    templateUrl: './destination-details.component.html',
    styleUrls: ['./destination-details.component.scss'],
    imports: [CommonModule,
        GalleriaComponent,
        AnimatedContainer,
        GoogleMapsModule,
        MapAdvancedMarker,
        MenuComponent,
        HeaderComponent,
        FooterComponent,
        AccordionModule,
        TranslateModule,
        RouterLink,
        UICarousel,
        UICarouselItem,
    ],
})
export class DestinationDetailsComponent {

    public destination?: IDestination;
    public tours: ITour[] = []
    public galleryColumns: {
        images: {
            image: string;
            height: number;
        }[];
    }[] = [];
    @ViewChild(GalleriaComponent)

    public galleria!: GalleriaComponent;
    public map!: any;
    public markers: any[] = [];
    public _destroy$ = new Subject<void>();
    private _showMapSubject = new BehaviorSubject<boolean>(false);
    layoutService = inject(LayoutService);
    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
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

    public title = '';
    public description = '';

    public breakpoints = {
        576: {
            size: '100%',
            spacing: '24px'
        },

        992: {
            size: '50%',
            spacing: '24px'
        },

        1200: {
            size: '33.333%',
            spacing: '24px'
        }
    };

    constructor(
        private route: ActivatedRoute,
        private _googleMapsLoader: GoogleMapsLoaderService,
        private destinationsService: DestinationsService,
        public localization: LocalizationService,
        private seoService: SeoService,
        private _cdr: ChangeDetectorRef,
        private toursService: ToursService,
        public image: ImageService,
    ) { }

    public ngOnInit(): void {


        this._watchForMapAPILoadChanges();


        this.localization.languageChanged$
            .pipe(
                map(event => event.lang),
                takeUntil(this._destroy$)
            )
            .subscribe(lang => {

                this._googleMapsLoader
                    .reloadWithNewLanguage(lang);

                if (this.destination) {
                    this.updateLocalizedContent();
                }

            });

        const slug =
            this.route.snapshot.paramMap.get('slug');

        if (!slug) {
            return;
        }

        this.destinationsService
            .getBySlug(slug)
            .subscribe(destination => {

                if (!destination) {
                    return;
                }

                this.destination = destination;



                this.toursService
                    .getByDestination(destination.slug)
                    .pipe(takeUntil(this._destroy$))
                    .subscribe(tours => {

                        this.tours = tours;

                    });


                const images =
                    this.destination.images?.length
                        ? this.destination.images
                        : [this.destination.image];

                this.galleryColumns = [
                    {
                        images: [
                            {
                                image: images[0] ?? this.destination.image,
                                height: 223
                            },
                            {
                                image: images[1] ?? images[0] ?? this.destination.image,
                                height: 221
                            }
                        ]
                    },
                    {
                        images: [
                            {
                                image: images[2] ?? images[0] ?? this.destination.image,
                                height: 461
                            }
                        ]
                    },
                    {
                        images: [
                            {
                                image: images[3] ?? images[0] ?? this.destination.image,
                                height: 461
                            }
                        ]
                    },
                    {
                        images: [
                            {
                                image: images[4] ?? images[0] ?? this.destination.image,
                                height: 223
                            },
                            {
                                image: images[5] ?? images[0] ?? this.destination.image,
                                height: 223
                            }
                        ]
                    }
                ];

                const [lng, lat] = this.destination.coordinates;

                this.mapOptions = {
                    ...this.mapOptions,
                    center: { lat, lng }
                };


                const marker = this.buildMarker(point(this.destination?.coordinates as any, { name: ' ' }) as any, '', '');
                this.markers.push(marker);


                if (this.destination.locations?.length) {

                    const locationMarkers =
                        this.destination.locations
                            .filter(location => location.coordinates?.length)
                            .map(location =>
                                this.buildLocationMarker(
                                    point(location.coordinates as any, {
                                        name: this.localization.getText(location.name)
                                    }) as any
                                )
                            );

                    this.markers.push(...locationMarkers);

                }


            });
    }

    public ngOnDestroy(): void {

        this._destroy$.next();
        this._destroy$.complete();
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

        if (!this.destination) {
            return;
        }

        this.title =
            this.localization.getText(
                this.destination.titleHeader ??
                this.destination.title
            );

        this.description =
            this.localization.getText(
                this.destination.description
            );

        this.updateSeo();
    }


    public onMapInitialized(
        map: google.maps.Map
    ): void {

        this.map = map;
        this.fitBounds();
    }


    private updateSeo(): void {

        if (!this.destination) {
            return;
        }

        this.seoService.update({

            title: this.localization.getText(
                this.destination.seo?.title ??
                this.destination.titleHeader ??
                this.destination.title
            ),

            description: this.localization.getText(
                this.destination.seo?.description ??
                this.destination.destinationHeader ??
                this.destination.description
            ),

            keywords: this.destination.seo?.keywords
                ? this.localization.getText(
                    this.destination.seo.keywords
                )
                : undefined,

            image:
                this.destination.seo?.image ??
                this.destination.image,

            type:
                this.destination.seo?.type ??
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

        if (!this.destination) {
            return [];
        }

        const images = this.destination.images?.length
            ? this.destination.images
            : [this.destination.image];

        return images.map(image =>
            this.image.getImage(image, 1600)
        );
    }


    trackBy(index: number, m: any): string {
        return m.label;
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