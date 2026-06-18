import { Component, OnInit } from '@angular/core';
import { AnimatedContainer } from '../animatedcontainer';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
  imports: [
    CommonModule,
    AnimatedContainer,
    FooterComponent

  ],
  standalone: true
})
export class ErrorPageComponent implements OnInit {

  public ngOnInit(): void {

  }


}
