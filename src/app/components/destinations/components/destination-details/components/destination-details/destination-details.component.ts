import { Component, computed, inject, Input, ViewChild } from "@angular/core";
import { FooterComponent } from "../../../../../footer/footer.component";
import { MenuComponent } from "../../../../../menu/components/menu.component";
import { HeaderComponent } from "../../../../../header/header.component";
import { AnimatedContainer } from "../../../../../animatedcontainer";
import { IDestination } from "../../../../interfaces/destination.interface";
import { ActivatedRoute } from "@angular/router";
import { DestinationsService } from "../../../../services/destinations.service";
import { GoogleMapsLoaderService } from "../../../../../../services/google-maps-loader.service";
import { BehaviorSubject, debounceTime, Observable, Subject, takeUntil, timer } from "rxjs";
import { LocalizationService } from "../../../../../../services/localization.service";
import { GoogleMapsModule, MapAdvancedMarker } from "@angular/google-maps";
import { CommonModule } from "@angular/common";
import { Feature, Point } from "geojson";
import { point } from "@turf/helpers";
import { GalleriaComponent } from "../../../../../galleria/galleria.component";
import { LayoutService } from "../../../../../../services/layout.service";
@Component({
    selector: "app-destination-details",
    standalone: true,
    templateUrl: './destination-details.component.html',
    styleUrls: ['./destination-details.component.scss'],
    imports: [CommonModule, GalleriaComponent, AnimatedContainer, GoogleMapsModule, MapAdvancedMarker, MenuComponent,
        HeaderComponent, FooterComponent],
})
export class DestinationDetailsComponent {

    public destination?: IDestination;
    public galleryColumns: {
        images: {
            image: string;
            height: number;
        }[];
    }[] = [];
    @ViewChild(GalleriaComponent)

    public galleria!: GalleriaComponent;
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

    public get title(): string {
        return this.destination
            ? this.localization.getText(this.destination.title)
            : '';
    }
    public description = '';

    constructor(
        private route: ActivatedRoute,
        private _googleMapsLoader: GoogleMapsLoaderService,
        private destinationsService: DestinationsService,
        public localization: LocalizationService,
    ) { }

    public ngOnInit(): void {


        this._watchForMapAPILoadChanges();

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


            });
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

        return this.destination.images?.length
            ? this.destination.images
            : [this.destination.image];
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