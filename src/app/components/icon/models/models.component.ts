import { Component, Input } from "@angular/core";

@Component({
  selector: "ModelsBoxIcon",
  standalone: true,
  templateUrl:'./models.component.html'
})
export class ModelsBoxIconComponent {
  @Input() className: any = "";
}
