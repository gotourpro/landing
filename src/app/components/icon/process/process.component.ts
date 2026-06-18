import { Component, Input } from "@angular/core";

@Component({
    selector: "IconProcess",
    standalone: true,
    template: `

<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2033_785)">
<mask id="mask0_2033_785" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="45" height="45">
<path d="M44 44V1H1V44H44Z" fill="white" stroke="white" stroke-width="2"/>
</mask>
<g mask="url(#mask0_2033_785)">
<path d="M19.7754 43.6816V39.4893C17.1293 39.0658 14.5878 38.0114 12.4167 36.4364L9.44886 39.4043L5.59573 35.551L8.56362 32.5833C6.98853 30.4119 5.9342 27.8705 5.51074 25.2246H1.31836V19.7754H5.51074C5.9342 17.1294 6.98853 14.5879 8.56362 12.4168L5.59573 9.44886L9.44886 5.59573L12.4167 8.56363C14.5879 6.98854 17.1294 5.9342 19.7754 5.51075V1.31836H25.2246V5.51075C27.8706 5.9342 30.4121 6.98854 32.5832 8.56363L35.5511 5.59573L39.4043 9.44886L36.4364 12.4168C38.0115 14.5879 39.0658 17.1294 39.4893 19.7754H43.6816V25.2246H39.4893C39.0658 27.8705 38.0115 30.4119 36.4364 32.5833L39.4043 35.551L35.5511 39.4043L32.5832 36.4364C30.4122 38.0114 27.8707 39.0658 25.2246 39.4893V43.6816H19.7754Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
<path d="M22.5 31.7285C17.4119 31.7285 13.2715 27.5881 13.2715 22.5C13.2715 17.4119 17.4119 13.2715 22.5 13.2715C27.5881 13.2715 31.7285 17.4119 31.7285 22.5C31.7285 27.5881 27.5881 31.7285 22.5 31.7285Z" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
<path d="M18.5449 22.5L21.1816 25.1367L26.4551 19.8633" stroke="#1BBC9B" stroke-width="2" stroke-miterlimit="10"/>
</g>
</g>
<defs>
<clipPath id="clip0_2033_785">
<rect width="45" height="45" fill="white"/>
</clipPath>
</defs>
</svg>


  `,
})
export class ProcessIcon {
    @Input() className: any = "";
}
