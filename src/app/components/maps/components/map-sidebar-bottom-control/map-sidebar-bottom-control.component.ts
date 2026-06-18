import { CommonModule } from '@angular/common';
import { Component, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
// external libs
import { Subject } from 'rxjs';

@Component({
    selector: 'map-sidebar-bottom-control',
    templateUrl: './map-sidebar-bottom-control.component.html',
    styleUrls: ['./map-sidebar-bottom-control.component.scss'],
    imports: [
        CommonModule, ButtonModule, TooltipModule, FormsModule
    ]
})
export class MapSidebarBottomControlComponent {

  @Input() public isShowSettingsControl = false;
  @Input() public isDisableSettingsControl = false;
  @Input() public isResetSettingsControl = true;
  @Input() public tooltipSettings = 'Дополнительно';

  @Output() public changeSettings: Subject<boolean> = new Subject<boolean>();



  public onChangeSettings(): void {
    this.changeSettings.next(true);
  }

}
