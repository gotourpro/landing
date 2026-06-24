import { Component, computed, ElementRef, HostListener, inject, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { LayoutService } from "../../../../services/layout.service";
import { TextAnimationDirective } from "../../../../directives/text-animation/text-animation.directive";
import { ImageAnimationDirective } from "../../../../directives/image-animation/image-animation.directive";
import { ParallaxDirective } from "../../../../directives/parallax.directive";
import { UICarousel } from "../../../UI/carousel";
import { UICarouselItem } from "../../../UI/carousel-item";
import { ITestimonial } from "../../../testimonials/interfaces/itestimonial.interface";
import { TestimonialsService } from "../../../testimonials/services/testimonials.service";
import jsVectorMap from 'jsvectormap'
import '../../../../../assets/data/maps/china.js';
import { merge, of, Subject, takeUntil, timer } from "rxjs";
import { CountUpModule } from 'ngx-countup';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
@Component({
    selector: "app-home-individual-tours",
    standalone: true,
    templateUrl: './home-individual-tours.component.html',
    styleUrls: ['./home-individual-tours.component.scss'],
    imports: [
        AnimatedContainer,
        UICarousel,
        UICarouselItem,
        ParallaxDirective,
        TextAnimationDirective,
        ImageAnimationDirective,
        CommonModule,
        CountUpModule,
        TranslateModule
    ],
})

export class HometeIndividualToursComponent {
    layoutService = inject(LayoutService);
    isDarkTheme = computed(() => this.layoutService?.isDarkTheme());
    isMobile = computed(() => this.layoutService.isMobile());
    isWide = computed(() => this.layoutService.isWide());

    @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

    public map: any;
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    public testimonialsItems: ITestimonial[] = [];

    public readonly companyStats = [
        {
            value: 5,
            suffix: '+',
            textKey: 'components.homeIndividualTours.stats.experience'
        },
        {
            value: 50,
            suffix: '+',
            textKey: 'components.homeIndividualTours.stats.destinations'
        },
        {
            value: 2000,
            suffix: '+',
            textKey: 'components.homeIndividualTours.stats.completedTours'
        }
    ];

    constructor(private translateService: TranslateService) { }

    public readonly destinations = [
        { key: 'components.homeIndividualTours.destinations.yunnan', coords: [25.0438, 102.7100] },
        { key: 'components.homeIndividualTours.destinations.beijing', coords: [39.9042, 116.4074] },
        { key: 'components.homeIndividualTours.destinations.shanghai', coords: [31.2304, 121.4737] },
        { key: 'components.homeIndividualTours.destinations.chengdu', coords: [30.5728, 104.0668] },
        { key: 'components.homeIndividualTours.destinations.harbin', coords: [45.8038, 126.5350] },
        { key: 'components.homeIndividualTours.destinations.shenzhen', coords: [22.5431, 114.0579] },
        { key: 'components.homeIndividualTours.destinations.hainan', coords: [20.0442, 110.1999] }
    ];

    public ngOnInit(): void { }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
        this.safeDestroyMap();
    }

    public ngAfterViewInit(): void {

        merge(
            of(null),
            this.translateService.onLangChange
        )
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this.initMap();
            });
    }


    private safeDestroyMap(): void {
        if (this.map) {
            try {

                if (typeof this.map.destroy === 'function') {
                    this.map.destroy();
                }
            } catch (error) {

                console.warn('jsVectorMap destroyed with silent error:', error);
            } finally {
                this.map = null;
            }
        }


        if (this.mapContainer?.nativeElement) {
            this.mapContainer.nativeElement.innerHTML = '';
        }
    }

    private initMap(): void {
        this.translateService
            .get(this.destinations.map(d => d.key))
            .pipe(takeUntil(this._destroy$))
            .subscribe(translations => {


                this.safeDestroyMap();


                this.map = new jsVectorMap({
                    selector: this.mapContainer.nativeElement,
                    map: 'china_merc_en',
                    showTooltip: false,
                    zoomButtons: false,
                    zoomOnScroll: false,
                    regionStyle: {
                        initial: { fill: '#d5f4ed', stroke: '#8ee0cf', strokeWidth: 1.2 },
                        hover: { fill: '#c7f1e8', stroke: '#27c7a8' },
                        selected: { fill: '#ff9f1c', stroke: '#ff9f1c' }
                    },
                    markerStyle: {
                        initial: { fill: '#ffb84d', stroke: '#ffffff', strokeWidth: 3, r: 7 },
                        hover: { fill: '#ffb84d', stroke: '#ffffff', strokeWidth: 3, r: 9 }
                    },
                    markers: this.destinations.map(destination => ({
                        coords: destination.coords,
                        name: translations[destination.key],
                        style: { initial: { fill: '#F8931F' } }
                    })),
                    labels: {
                        markers: {
                            render(marker: any) {
                                return marker.name;
                            }
                        }
                    }
                });

                this.triggerResize();
            });
    }

    public triggerResize() {
        timer(100)
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => this.handleResize());
    }

    @HostListener('window:resize')
    private handleResize() {
        this.map?.updateSize();
    }
}
