
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AnimatedContainer } from "../../../animatedcontainer";
import { ToursService } from "../../services/tours.service";
import { LocalizationService } from "../../../../services/localization.service";
import { ITour } from "../../interfaces/tour.interface";
import { GalleriaComponent } from "../../../galleria/galleria.component";
import { ButtonModule } from "primeng/button";
import { HeaderComponent } from "../../../header/header.component";
import { MenuComponent } from "../../../menu/components/menu.component";
import { FooterComponent } from "../../../footer/footer.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TourCategoryService } from "../../services/tours-category.service";
import { ICategoryOption } from "../../interfaces/category-option.interface";
import { SelectButtonModule } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import { SkeletonModule } from 'primeng/skeleton';
import { LayoutService } from "../../../../services/layout.service";
@Component({
    selector: "app-tour-list",
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        AnimatedContainer,
        ButtonModule,
        GalleriaComponent,
        HeaderComponent,
        MenuComponent,
        AnimatedContainer,
        FooterComponent,
        TranslateModule,
        SelectButtonModule,
        FormsModule,
        SkeletonModule
    ],
    templateUrl: './tour-list.component.html',
    styleUrls: ['./tour-list.component.scss'],
})
export class TourListComponent {

    @ViewChild('gallery')
    public galleria: GalleriaComponent;
    public layoutService = inject(LayoutService);
    public isMobile = computed(() => this.layoutService.isMobile());
    public title = 'Tour List';
    public description = ''
    public tours: ITour[] = [];
    public page = 1;
    public limit = 3;
    public hasMore = true;
    public loading = false;
    public initialLoading = true;
    public categories: ICategoryOption[] = [];
    public selectedCategory: string;

    constructor(
        private route: ActivatedRoute,
        private toursService: ToursService,
        public localization: LocalizationService,
        private tourCategoriesService: TourCategoryService,
        private translate: TranslateService,
        private _cdr: ChangeDetectorRef,
        private router: Router
    ) {
        this.selectedCategory =
            this.route.snapshot.paramMap.get('slug') ?? 'all';
    }


    public ngOnInit(): void {
        this.loadCategories();

        this.translate.onLangChange.subscribe(() => {
            this.loadCategories();
        });

        this.route.paramMap.subscribe(params => {

            this.selectedCategory =
                params.get('slug') ?? 'all';

            this.reset();

            this.loadMore();
        });
    }

    public get selectButtonSize():
        any {

        return this.isMobile()
            ? 'small'
            : undefined;
    }
    private loadCategories(): void {

        this.tourCategoriesService
            .getList()
            .subscribe(categories => {

                this.categories = [
                    {
                        value: 'all',
                        label: this.translate.instant(
                            'components.tour.allTours'
                        )
                    },
                    ...categories.map(
                        category => ({
                            value: category.slug,
                            label: this.localization.getText(
                                category.shortTitle ?? category.title
                            )
                        })
                    )
                ];
            });
    }

    private reset(): void {

        this.tours = [];

        this.page = 1;

        this.hasMore = true;

        this.loading = false;
        this.initialLoading = true;

    }

    public ngAfterViewInit(): void {
    }

    public loadMore(): void {

        if (!this.hasMore || this.loading) {
            return;
        }

        this.loading = true;

        const request$ =
            this.selectedCategory === 'all'
                ? this.toursService.getPage(
                    this.page,
                    this.limit
                )
                : this.toursService.getPageByCategory(
                    this.selectedCategory,
                    this.page,
                    this.limit
                );

        request$
            .subscribe(response => {

                this.tours = [
                    ...this.tours,
                    ...response.items
                ];

                this.hasMore = response.hasMore;
                this.page++;
                this.loading = false;
                this.initialLoading = false;
            });
    }

    public onCategoryChange(
        slug: string
    ): void {

        if (slug === 'all') {

            this.router.navigate([
                '/tours'
            ]);

            return;
        }

        this.router.navigate([
            '/tours/category',
            slug
        ]);
    }


    public openGallery(item: any): void {

        const images = item.images?.length
            ? item.images
            : [item.image];
        this.galleria.open(images);
    }
}
