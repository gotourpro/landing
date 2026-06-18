import { Component, Input } from "@angular/core";

@Component({
  selector: "ContentBoxIcon",
  standalone: true,
  templateUrl:'./content.component.html'
})
export class ContentBoxIconComponent {
  @Input() className: any = "";
}
