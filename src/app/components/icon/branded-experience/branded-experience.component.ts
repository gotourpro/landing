import { Component, Input } from "@angular/core";

@Component({
  selector: "BrandedExperienceBoxIcon",
  standalone: true,
  templateUrl:'./branded-experience.component.html'
})
export class BrandedExperienceBoxIconComponent {
  @Input() className: any = "";
}
