
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AnimatedContainer } from "../../../animatedcontainer";
import { MenuComponent } from "../../../menu/components/menu.component";
import { FooterComponent } from "../../../footer/footer.component";
import { HeaderComponent } from "../../../header/header.component";
import { IBlogPost } from "../../interfaces/blog-post.interface";
import { BlogService } from "../../services/blog.service";
import { LocalizationService } from "../../../../services/localization.service";
import { ButtonModule } from "primeng/button";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GalleriaComponent } from "../../../galleria/galleria.component";
import { LayoutService } from "../../../../services/layout.service";
import { ICategoryOption } from "../../../tours/interfaces/category-option.interface";
import { BlogCategoryService } from "../../services/blog-category.service";
import { SelectButtonModule } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import { SkeletonModule } from "primeng/skeleton";
import { ImageService } from "../../../../services/image-service";

@Component({
    selector: "app-blog-list",
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ButtonModule,
        AnimatedContainer,
        AnimatedContainer,
        MenuComponent,
        FooterComponent,
        HeaderComponent,
        TranslateModule,
        SelectButtonModule,
        FormsModule,
        SkeletonModule
    ],
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss'],
})

export class BlogListComponent {

    @ViewChild('gallery')
    public galleria: GalleriaComponent;
    public layoutService = inject(LayoutService);
    public isMobile = computed(() => this.layoutService.isMobile());
    public title = 'Tour List';
    public description = ''
    public blogs: IBlogPost[] = [];
    public page = 1;
    public limit = 3;
    public hasMore = true;
    public loading = false;
    public initialLoading = true;
    public categories: ICategoryOption[] = [];
    public selectedCategory: string;

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService,
        public localization: LocalizationService,
        private blogCategoriesService: BlogCategoryService,
        private translate: TranslateService,
        private _cdr: ChangeDetectorRef,
        public image: ImageService,
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

        this.blogCategoriesService
            .getList()
            .subscribe(categories => {
                this.categories = [
                    {
                        value: 'all',
                        label: this.translate.instant(
                            'components.blog.allCategories'
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

        this.blogs = [];

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
                ? this.blogService.getPage(
                    this.page,
                    this.limit
                )
                : this.blogService.getPageByCategory(
                    this.selectedCategory,
                    this.page,
                    this.limit
                );

        request$
            .subscribe(response => {

                this.blogs = [
                    ...this.blogs,
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
                '/blog'
            ]);

            return;
        }

        this.router.navigate([
            '/blog/category',
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
