import { Component, Input } from "@angular/core";

@Component({
  selector: "FastCommunicationBoxIcon",
  standalone: true,
  templateUrl:'./fast-communication.component.html'
})
export class FastCommunicationBoxIconComponent {
  @Input() className: any = "";
}
