import { Component, Input } from "@angular/core";

@Component({
  selector: "ReadyServiceBoxIcon",
  standalone: true,
  templateUrl:'./ready-service.component.html'
})
export class ReadyServiceBoxIconComponent {
  @Input() className: any = "";
}
