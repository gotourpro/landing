import { Component, Input } from "@angular/core";

@Component({
  selector: "GoogleBoxIcon",
  standalone: true,
  templateUrl:'./google.component.html'
})
export class GoogleBoxIconComponent {
  @Input() className: any = "";
}
