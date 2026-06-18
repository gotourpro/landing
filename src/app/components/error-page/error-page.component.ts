import { Component, OnInit } from '@angular/core';
import { AnimatedContainer } from '../animatedcontainer';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/components/menu.component';
@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
  imports: [
    CommonModule,
    AnimatedContainer,
    TranslateModule,
    ButtonModule,
    RouterLink,
    FooterComponent,
    HeaderComponent,
    MenuComponent

  ],
  standalone: true
})
export class ErrorPageComponent implements OnInit {

  public ngOnInit(): void {

  }


}
