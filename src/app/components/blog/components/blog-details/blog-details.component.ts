import { Component, DestroyRef, inject } from "@angular/core";
import { FooterComponent } from "../../../footer/footer.component";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { MenuComponent } from "../../../menu/components/menu.component";
import { TagModule } from 'primeng/tag';
import { IBlogPost } from "../../interfaces/blog-post.interface";
import { BlogService } from "../../services/blog.service";
import { IBlogContentBlock } from "../../types/block.type";
import { IBlogQuoteBlock, IBlogSectionBlock } from "../../interfaces/blog-section-block.interface";
import { LocalizationService } from "../../../../services/localization.service";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, filter, map, switchMap } from "rxjs";
import { IBlogTag } from "../../interfaces/blog-tags.interface";
import { BlogTagService } from "../../services/blog-tag.service";
import { IBlogFaqBlock } from "../../interfaces/blog-faq.interface";
import { AccordionModule } from "primeng/accordion";
import { SeoService } from "../../../../services/seo.service";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: "app-blog-details",
    standalone: true,
    imports: [
        CommonModule,
        AnimatedContainer,
        MenuComponent,
        FooterComponent,
        TagModule,
        AccordionModule,
        ButtonModule
    ],
    templateUrl: './blog-details.component.html',
    styleUrl: './blog-details.component.scss',
})
export class BlogDetailsComponent {

    protected post?: IBlogPost;
    public tags: IBlogTag[] = [];

    private readonly destroyRef =
        inject(DestroyRef);

    constructor(
        private readonly route: ActivatedRoute,
        private readonly blogService: BlogService,
        private readonly blogTagService: BlogTagService,
        private readonly seo: SeoService,
        public localization: LocalizationService,
    ) { }

    protected isSection(
        block: IBlogContentBlock
    ): block is IBlogSectionBlock {
        return block.type === 'section';
    }

    protected isQuote(
        block: IBlogContentBlock
    ): block is IBlogQuoteBlock {
        return block.type === 'quote';
    }

    protected getNextQuote(
        blocks: IBlogContentBlock[],
        index: number
    ): IBlogQuoteBlock | null {

        const next = blocks[index + 1];

        return next?.type === 'quote'
            ? next
            : null;
    }

    protected get firstQuote(): IBlogQuoteBlock | undefined {
        return this.post?.blocks.find(
            (block): block is IBlogQuoteBlock =>
                block.type === 'quote'
        );
    }


    public isFaq(
        block: IBlogContentBlock
    ): block is IBlogFaqBlock {

        return block.type === 'faq';

    }

    public getFaqBlock(): IBlogFaqBlock | undefined {
        return this.post?.blocks.find(
            this.isFaq
        );

    }

    public ngOnInit(): void {

        const slug =
            this.route.snapshot.paramMap.get('slug');

        if (!slug) {
            return;
        }

        combineLatest([
            this.blogService.getBySlug(slug),
            this.blogTagService.getList()
                .pipe(
                    takeUntilDestroyed(this.destroyRef)
                )
        ]).subscribe(([post, allTags]) => {

            if (!post) {
                return;
            }

            this.post = post;

            this.tags = allTags.filter(tag =>
                post.tagSlugs?.includes(tag.slug)
            );

            this.updateSeo();

        });

        this.localization.languageChanged$
            .subscribe(() => {

                this.updateSeo();

            });

    }


    private updateSeo(): void {

        if (!this.post) {
            return;
        }

        this.seo.update({

            title: this.localization.getText(
                this.post.seo?.title ?? this.post.title
            ),

            description: this.localization.getText(
                this.post.seo?.description ?? this.post.description
            ),

            keywords: this.post.seo?.keywords
                ? this.localization.getText(this.post.seo.keywords)
                : this.tags
                    .map(tag =>
                        this.localization.getText(tag.title)
                    )
                    .join(', '),

            image: this.post.hero.image,
            url: window.location.href,
            type: 'article',
            author: this.post.author,
            publishedTime: this.post.publishedAt,
            modifiedTime: this.post.updatedAt,
            lang: this.localization.getCurrentLanguage(),

        });

    }

    public onShare(
        platform: 'telegram' | 'whatsapp' | 'facebook' | 'x'
    ): void {

        if (!this.post) {
            return;
        }

        const url = encodeURIComponent(window.location.href);

        const title = encodeURIComponent(
            this.localization.getText(this.post.title)
        );

        let shareUrl = '';

        switch (platform) {

            case 'telegram':
                shareUrl =
                    `https://t.me/share/url?url=${url}&text=${title}`;
                break;

            case 'whatsapp':
                shareUrl =
                    `https://wa.me/?text=${title}%20${url}`;
                break;

            case 'facebook':
                shareUrl =
                    `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;

            case 'x':
                shareUrl =
                    `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
                break;

        }

        window.open(
            shareUrl,
            '_blank',
            'noopener,noreferrer'
        );

    }
}
