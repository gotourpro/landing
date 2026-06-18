import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { twMerge } from "tailwind-merge";
import { AnimatedContainer } from "../animatedcontainer";

@Component({
  selector: "app-grid-card",
  standalone: true,
  imports: [CommonModule, AnimatedContainer],
  templateUrl:'./grid-card.component.html'
  
})
export class GridCardComponent {
  @Input() className?: string;
  @Input() image!: string;
  @Input() title!: string;
  @Input() href!: string;

  delay: number = Math.floor(Math.random() * 500);

  twMerge = twMerge;
}
