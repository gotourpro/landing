import { Component, Input } from "@angular/core";

@Component({
  selector: "FreeBoxIcon",
  standalone: true,
  templateUrl:'./free.component.html'
})
export class FreeBoxIconComponent {
  @Input() className: any = "";
}
