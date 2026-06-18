
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AnimatedContainer } from "../../../animatedcontainer";
import { MenuComponent } from "../../../menu/components/menu.component";
import { FooterComponent } from "../../../footer/footer.component";
import { HeaderComponent } from "../../../header/header.component";
import { IBlogPost } from "../../interfaces/blog-post.interface";
import { BlogService } from "../../services/blog.service";
import { LocalizationService } from "../../../../services/localization.service";
import { ButtonModule } from "primeng/button";
import { TranslateModule } from '@ngx-translate/core';

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
        BlogListComponent,
        FooterComponent,
        HeaderComponent,
        TranslateModule
    ],
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent {
    public blogs: IBlogPost[] = [];
    public page = 1;
    public limit = 3;
    public hasMore = true;
    public loading = false;

    constructor(
        private blogService: BlogService,
        public localization: LocalizationService
    ) { }



    public ngOnInit(): void {
        this.loadMore();
    }

    public loadMore(): void {

        if (!this.hasMore || this.loading) {
            return;
        }

        this.loading = true;

        this.blogService
            .getPage(this.page, this.limit)
            .subscribe(response => {

                this.blogs = [
                    ...this.blogs,
                    ...response.items
                ];

                this.hasMore = response.hasMore;
                this.page++;

                this.loading = false;
            });
    }

}
