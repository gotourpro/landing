import { Component, Input } from "@angular/core";

@Component({
    selector: "IconAppointments",
    standalone: true,
    template: `

<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2033_839)">
<mask id="mask0_2033_839" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="45" height="45">
<path d="M44 44V1H1V44H44Z" fill="white" stroke="white" stroke-width="2"/>
</mask>
<g mask="url(#mask0_2033_839)">
<path d="M26.4551 26.4551C26.4551 28.6394 24.6843 30.4102 22.5 30.4102C20.3157 30.4102 18.5449 28.6394 18.5449 26.4551C18.5449 24.2707 20.3157 22.5 22.5 22.5C24.6843 22.5 26.4551 24.2707 26.4551 26.4551Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
<path d="M22.5 33.0469C19.5876 33.0469 17.2266 35.4958 17.2266 38.4082V43.6816H27.7734V38.4082C27.7734 35.4958 25.4124 33.0469 22.5 33.0469Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
<path d="M10.6348 23.8184C10.6348 26.0027 8.86403 27.7734 6.67969 27.7734C4.49534 27.7734 2.63672 26.0027 2.63672 23.8184C2.63672 21.634 4.49534 19.8633 6.67969 19.8633C8.86403 19.8633 10.6348 21.634 10.6348 23.8184Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
<path d="M6.67969 30.4102C3.76726 30.4102 1.31836 32.7712 1.31836 35.6836V41.0449H11.9531V35.6836C11.9531 32.7712 9.59212 30.4102 6.67969 30.4102Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
<path d="M42.2754 23.8184C42.2754 26.0027 40.5047 27.7734 38.3203 27.7734C36.136 27.7734 34.3652 26.0027 34.3652 23.8184C34.3652 21.634 36.136 19.8633 38.3203 19.8633C40.5047 19.8633 42.2754 21.634 42.2754 23.8184Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
<path d="M38.3203 30.4102C35.4079 30.4102 33.0469 32.7712 33.0469 35.6836V41.0449H43.6816V35.6836C43.6816 32.7712 41.2327 30.4102 38.3203 30.4102Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
<path d="M30.4102 9.31641C30.4102 13.6851 26.8687 17.2266 22.5 17.2266C18.1313 17.2266 14.5898 13.6851 14.5898 9.31641C14.5898 4.94772 18.1313 1.31836 22.5 1.31836C26.8687 1.31836 30.4102 4.94772 30.4102 9.31641Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
<path d="M22.5 5.36133V9.31641H26.4551" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
</g>
</g>
<defs>
<clipPath id="clip0_2033_839">
<rect width="45" height="45" fill="white"/>
</clipPath>
</defs>
</svg>


  `,
})
export class AppointmentsIcon {
    @Input() className: any = "";
}
