import { Component, ViewChild } from "@angular/core";
import { AnimatedContainer } from "../../../animatedcontainer";
import { MenuComponent } from "../../../menu/components/menu.component";
import { HeaderComponent } from "../../../header/header.component";
import { FooterComponent } from "../../../footer/footer.component";
import { ITour } from "../../interfaces/tour.interface";
import { ActivatedRoute } from "@angular/router";
import { ToursService } from "../../services/tours.service";
import { LocalizationService } from "../../../../services/localization.service";
import { GoogleMapsLoaderService } from "../../../../services/google-maps-loader.service";
import { GoogleMapsModule, MapAdvancedMarker } from "@angular/google-maps";
import { Feature, Point } from "geojson";
import { BehaviorSubject, debounceTime, Observable, Subject, takeUntil, timer } from "rxjs";
import { point } from "@turf/helpers";
import { CommonModule } from "@angular/common";
import { GalleriaComponent } from "../../../galleria/galleria.component";
@Component({
    selector: "app-tour-details",
    standalone: true,
    templateUrl: './tour-details.component.html',
    styleUrls: ['./tour-details.component.scss'],
    imports: [CommonModule, AnimatedContainer, MenuComponent,
        HeaderComponent, FooterComponent, GoogleMapsModule, MapAdvancedMarker, GalleriaComponent],
})
export class TourDetailsComponent {
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

        ],
        gestureHandling: 'greedy',
        scrollwheel: true,
        clickableIcons: false
    };


    constructor(
        private route: ActivatedRoute,
        private toursService: ToursService,
        public localization: LocalizationService,
        private _googleMapsLoader: GoogleMapsLoaderService,
    ) { }

    ngOnInit(): void {

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
                this.setDetails();

            });


        this._watchForMapAPILoadChanges();
    }


    setDetails(): void {

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


        const marker = this.buildMarker(point(this.tour?.coordinates as any, { name: ' ' }) as any, '', '');
        this.markers.push(marker);
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

        return this.tour.images?.length
            ? this.tour.images
            : [this.tour.image];
    }
    trackBy(index: number, m: any): string {
        return m.label;
    }

    getGallerySpan(span: number): string {
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