import { Component } from "@angular/core";
import { FooterComponent } from "../../../footer/footer.component";
import { HeaderComponent } from "../../../header/header.component";
import { CommonModule } from "@angular/common";
import { AnimatedContainer } from "../../../animatedcontainer";
import { MenuComponent } from "../../../menu/components/menu.component";
import { TagModule } from 'primeng/tag';
@Component({
    selector: "app-blog-details",
    standalone: true,
    imports: [
        CommonModule,
        AnimatedContainer,
        MenuComponent,
        HeaderComponent,
        FooterComponent,
        TagModule
    ],
    templateUrl: './blog-details.component.html',
    styleUrl: './blog-details.component.scss',
})
export class BlogDetaislComponent {

    public title = 'Blog Details';
    public description = 'Blog Details2';

    public tags: string[] = [
        'Travel',
        'Destination',
        'Tour Guide'
    ];
}
