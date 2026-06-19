import { Component } from "@angular/core";
import { AnimatedContainer } from "../../../animatedcontainer";
import { BlogListComponent } from "../blog-list/blog-list.component";
import { FooterComponent } from "../../../footer/footer.component";
import { HeaderComponent } from "../../../header/header.component";
import { MenuComponent } from "../../../menu/components/menu.component";
@Component({
    selector: "app-blog",
    standalone: true,
    templateUrl: './blog.component.html',
    imports: [
        AnimatedContainer,
        MenuComponent,
        BlogListComponent,
        FooterComponent,
        HeaderComponent
    ],
})
export class BlogComponent {
    public title = 'Blog Details List eee';
    public description = 'Blog'
}
