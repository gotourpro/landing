import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { twMerge } from "tailwind-merge";

@Component({
  selector: "circle-pattern",
  standalone: true,
  imports: [CommonModule],
  template: `
    
  `,
})
export class CirclePattern {
  @Input() className?: string;
  
  twMerge = twMerge;
}
