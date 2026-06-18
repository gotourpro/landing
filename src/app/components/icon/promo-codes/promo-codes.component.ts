import { Component, Input } from "@angular/core";

@Component({
  selector: "PromoCodesBoxIcon",
  standalone: true,
  templateUrl:'./promo-codes.component.html'
})
export class PromoCodesBoxIconComponent {
  @Input() className: any = "";
}
