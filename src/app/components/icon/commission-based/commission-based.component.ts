import { Component, Input } from "@angular/core";

@Component({
  selector: "CommissionBasedBoxIcon",
  standalone: true,
  templateUrl:'./commission-based.component.html'
})
export class CommissionBasedBoxIconComponent {
  @Input() className: any = "";
}
