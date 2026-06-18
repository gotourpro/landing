import { Component, Input } from "@angular/core";

@Component({
  selector: "MultilingualDriversBoxIcon",
  standalone: true,
  templateUrl:'./multilingual-drivers.component.html'
})
export class MultilingualDriversBoxIconComponent {
  @Input() className: any = "";
}
