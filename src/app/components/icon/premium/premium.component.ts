import { Component, Input } from "@angular/core";

@Component({
  selector: "PremiumBoxIcon",
  standalone: true,
  templateUrl:'./premium.component.html'
})
export class PremiumBoxIconComponent {
  @Input() className: any = "";
}
