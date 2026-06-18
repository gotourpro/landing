import { Component, Input } from "@angular/core";

@Component({
    selector: "IconSelect",
    standalone: true,
    template: `
<svg width="45" height="45" viewBox="0 0 45 45" fill="none" [class]="className" xmlns="http://www.w3.org/2000/svg">
<path d="M38.8916 1.31836H24.4775V15.7324H38.8916V1.31836Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.73535 15.7324L18.1494 15.7324L18.1494 1.31836L3.73535 1.31836L3.73535 15.7324Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.73535 36.4746L18.1494 36.4746L18.1494 22.0605L3.73535 22.0605L3.73535 36.4746Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M41.0669 37.4115C40.1836 40.1168 38.7053 43.6816 38.7053 43.6816L25.8724 43.6746C25.5966 43.0516 23.8278 38.9022 23.5538 36.8077C22.9096 33.6472 25.2791 30.6721 28.5038 30.5851L28.5205 30.5877V23.6426C28.5205 22.1863 29.701 21.0059 31.1573 21.0059C32.6135 21.0059 33.794 22.1863 33.794 23.6426V31.3611L33.8766 31.3734L38.1648 32.3218C40.4473 32.8263 41.7938 35.1896 41.0669 37.4115Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28.5205 30.5859V35.7715" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M29.4653 7.88818L31.1353 9.55811L33.9038 6.78955" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `,
})
export class SelectIcon {
    @Input() className: any = "";
}
