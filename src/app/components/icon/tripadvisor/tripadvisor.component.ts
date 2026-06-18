import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "TripAdvisorBoxIcon",
  standalone: true,
  templateUrl:'./tripadvisor.component.html',
  imports:[CommonModule]
})
export class TripAdvisorBoxIconComponent {
  @Input() className: any = "";
  @Input() fillColor = "fill-[#505A7C] dark:fill-[#505A7C]";
}
