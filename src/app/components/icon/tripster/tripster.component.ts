import { Component, Input } from "@angular/core";

@Component({
  selector: "TripsterBoxIcon",
  standalone: true,
  templateUrl:'./tripster.component.html'
})
export class TripsterBoxIconComponent {
  @Input() className: any = "";
  @Input() fillColor = "fill-[#505A7C] dark:fill-[#505A7C]";
}
