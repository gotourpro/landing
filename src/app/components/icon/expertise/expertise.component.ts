import { Component, Input } from "@angular/core";

@Component({
  selector: "ExpertiseBoxIcon",
  standalone: true,
  templateUrl:'./expertise.component.html'
})
export class ExpertiseBoxIconComponent {
  @Input() className: any = "";
}
