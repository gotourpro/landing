import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AnimatedContainer } from "../../../animatedcontainer";
import { SelectIcon } from "../../../icon/select/select.component";
import { AppointmentsIcon } from "../../../icon/appointment/appointments.component";
import { ProcessIcon } from "../../../icon/process/process.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-home-how-to-work",
  standalone: true,
  templateUrl: './home-how-to-work.component.html',
  styleUrls: ['./home-how-to-work.component.scss'],
  imports: [
    CommonModule,
    AnimatedContainer,
    RouterLink,
    TranslateModule
  ],
})
export class HomeHowToWorkComponent {


  public howToWorkItems = [
  {
    icon: SelectIcon,
    titleKey: 'components.homeHowToWork.steps.selectDestination.title',
    textKey: 'components.homeHowToWork.steps.selectDestination.text',
    delay: 0
  },
  {
    icon: AppointmentsIcon,
    titleKey: 'components.homeHowToWork.steps.makeAppointment.title',
    textKey: 'components.homeHowToWork.steps.makeAppointment.text',
    delay: 100
  },
  {
    icon: ProcessIcon,
    titleKey: 'components.homeHowToWork.steps.enjoyTour.title',
    textKey: 'components.homeHowToWork.steps.enjoyTour.text',
    delay: 200
  }
];

  // howToWorkItems = [
  //   {
  //     icon: SelectIcon,
  //     title: 'Select Destination',
  //     text: 'In a free hour, when our power of choice is untrammelled and when nothing prevents dolor sit amet, consectetur',
  //   },
  //   {
  //     icon: AppointmentsIcon,
  //     title: 'Make an Appointments',
  //     text: 'Integer feugiat tortor non there are many other nullam In a free hour, when our power of choice is untrammelled',
  //   },
  //   {
  //     icon: ProcessIcon,
  //     title: 'Enjoy Our Tour',
  //     text: 'In a free hour, when our power of choice is untrammelled and when nothing prevents non there',
  //   }
  // ];


}
