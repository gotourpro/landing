import { Component, Input } from "@angular/core";

@Component({
  selector: "YandexBoxIcon",
  standalone: true,
  templateUrl:'./yandex.component.html'
})
export class YandexBoxIconComponent {
  @Input() className: any = "";
  @Input() fillColor = "fill-[#505A7C] dark:fill-[#505A7C]";
}
