import{a as et,b as tt,c as it,d as ot}from"./chunk-IAKPPCO2.js";import{a as nt}from"./chunk-B6B3SXBA.js";import{a as Xe}from"./chunk-NVZSUHRN.js";import{b as Ae,c as Ke,d as We,g as Je}from"./chunk-5UPT3LDO.js";import{Fb as Ve,Gb as C,Hb as Le,Ib as Ne,Ja as ze,Jb as He,Ka as B,Kb as R,Ma as Ee,Mb as Qe,Nb as Pe,O as Te,Ob as Ge,P as Me,Pa as Fe,Pb as Ue,Qb as Ze,Rb as Ye,S as Se,T as Ie,U as ke,Za as De,_a as je,b as _e,cb as Oe,d as ye,db as Be,e as j,g as Ce,gb as Re,h as $e,k as O,s as we}from"./chunk-UMSIEMQI.js";import{$ as w,$b as ue,Ab as h,Ac as ve,Ba as se,C as X,Ca as ae,Fb as c,Fc as P,Gb as l,Hb as d,Ib as ce,Ic as xe,Jb as pe,K as ee,Kb as D,Lb as me,Oc as qe,Pa as re,Pc as G,Qb as T,Rb as p,Rc as U,Sb as de,Tb as ge,Tc as Z,Ua as n,Vb as x,W as S,Xb as _,Ya as le,Yb as y,Za as b,aa as I,ac as v,bc as fe,cc as M,ea as te,fa as k,gb as E,hb as F,ib as V,ic as H,j as K,k as W,kb as L,kc as Q,lc as he,mb as g,na as ie,oa as oe,ra as z,rc as u,sc as f,t as J,tb as N,ub as s,vc as be,xa as ne}from"./chunk-FFD4EBCL.js";var st=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=F({type:e});static \u0275inj=I({})}return e})();var at=(()=>{class e{set errorMessages(t){this._overrides=t??{}}constructor(t,i){this.host=t,this.renderer=i,this._overrides={},this.defaultErrorMessages={required:"This field is required",minlength:o=>`The field value must be: from ${o.requiredLength} characters`,maxlength:o=>`The field value must be: no more than ${o.requiredLength} characters`,pattern:o=>"Enter date in dd.mm.yyyy hh:mm format",serverError:o=>o,min:"This field is required"},this.labelEl=null}ngAfterContentInit(){this.control=this.controlDir.control,this.wrapper=this.host.nativeElement,getComputedStyle(this.wrapper).position==="static"&&this.renderer.setStyle(this.wrapper,"position","relative"),this.inputEl=this.findInputElement(),this.labelEl=this.findLabel(),this.control.validator?.({value:null})?.required&&this.labelEl&&this.addRequiredStar(),this.createErrorContainer()}findInputElement(){return this.wrapper.querySelector("input.p-inputtext, input, p-iconfield input, p-select .p-dropdown")}findLabel(){let t=this.wrapper.querySelector("label");if(t)return t;let i=this.inputEl.id||this.inputEl.getAttribute("inputId");return i?document.querySelector(`label[for="${i}"]`):null}addRequiredStar(){if(!this.labelEl)return;let t=this.renderer.createElement("span");this.renderer.setStyle(t,"color","var(--p-red-400)"),this.renderer.setStyle(t,"margin-left","4px"),this.renderer.appendChild(t,this.renderer.createText("*")),this.renderer.appendChild(this.labelEl,t)}createErrorContainer(){this.errorContainer=this.renderer.createElement("div"),this.renderer.setStyle(this.errorContainer,"position","absolute"),this.renderer.setStyle(this.errorContainer,"top","100%"),this.renderer.setStyle(this.errorContainer,"left","0"),this.renderer.setStyle(this.errorContainer,"width","100%"),this.renderer.setStyle(this.errorContainer,"pointer-events","none"),this.wrapper.appendChild(this.errorContainer)}ngDoCheck(){if(!this.control||!this.inputEl||!this.errorContainer)return;let t=this.control.invalid&&(this.control.touched||this.control.dirty),i=this.inputEl.closest("p-iconfield, p-select")||this.inputEl;t?this.renderer.addClass(i,"p-invalid"):this.renderer.removeClass(i,"p-invalid"),this.updateErrorMessages(t)}updateErrorMessages(t){for(;this.errorContainer.firstChild;)this.errorContainer.removeChild(this.errorContainer.firstChild);if(t&&this.control.errors){let i=Object.keys(this.control.errors)[0],o=this.control.errors[i],r=this._overrides[i]??this.defaultErrorMessages[i],q=typeof r=="function"?r(o):r,$=this.renderer.createElement("small");this.renderer.addClass($,"required-error"),this.renderer.setStyle($,"color","var(--p-red-400)"),this.renderer.setStyle($,"font-size","12px"),this.renderer.appendChild($,this.renderer.createText(q)),this.renderer.appendChild(this.errorContainer,$)}}ngOnDestroy(){}static{this.\u0275fac=function(i){return new(i||e)(b(se),b(le))}}static{this.\u0275dir=V({type:e,selectors:[["","appFieldValidation",""]],contentQueries:function(i,o,m){if(i&1&&x(m,Le,7),i&2){let r;_(r=y())&&(o.controlDir=r.first)}},inputs:{errorMessages:[0,"appFieldValidation","errorMessages"]}})}}return e})();var mt=["container"],dt=["icon"],gt=["closeicon"],ut=["*"],ft=(e,a)=>({showTransitionParams:e,hideTransitionParams:a}),ht=e=>({value:"visible()",params:e}),bt=e=>({closeCallback:e});function vt(e,a){e&1&&D(0)}function xt(e,a){if(e&1&&g(0,vt,1,0,"ng-container",7),e&2){let t=p(2);s("ngTemplateOutlet",t.iconTemplate||t.iconTemplate)}}function _t(e,a){if(e&1&&d(0,"i",3),e&2){let t=p(2);s("ngClass",t.icon)}}function yt(e,a){if(e&1&&d(0,"span",9),e&2){let t=p(3);s("ngClass",t.cx("text"))("innerHTML",t.text,re)}}function Ct(e,a){if(e&1&&(c(0,"div"),g(1,yt,1,2,"span",8),l()),e&2){let t=p(2);n(),s("ngIf",!t.escape)}}function $t(e,a){if(e&1&&(c(0,"span",5),v(1),l()),e&2){let t=p(3);s("ngClass",t.cx("text")),n(),fe(t.text)}}function wt(e,a){if(e&1&&g(0,$t,2,2,"span",10),e&2){let t=p(2);s("ngIf",t.escape&&t.text)}}function Tt(e,a){e&1&&D(0)}function Mt(e,a){if(e&1&&g(0,Tt,1,0,"ng-container",11),e&2){let t=p(2);s("ngTemplateOutlet",t.containerTemplate||t.containerTemplate)("ngTemplateOutletContext",Q(2,bt,t.close.bind(t)))}}function St(e,a){if(e&1&&(c(0,"span",5),ge(1),l()),e&2){let t=p(2);s("ngClass",t.cx("text"))}}function It(e,a){if(e&1&&d(0,"i",13),e&2){let t=p(3);s("ngClass",t.closeIcon)}}function kt(e,a){e&1&&D(0)}function zt(e,a){if(e&1&&g(0,kt,1,0,"ng-container",7),e&2){let t=p(3);s("ngTemplateOutlet",t.closeIconTemplate||t._closeIconTemplate)}}function Et(e,a){e&1&&d(0,"TimesIcon",14)}function Ft(e,a){if(e&1){let t=me();c(0,"button",12),T("click",function(o){ie(t);let m=p(2);return oe(m.close(o))}),g(1,It,1,1,"i",13)(2,zt,1,1,"ng-container")(3,Et,1,0,"TimesIcon",14),l()}if(e&2){let t=p(2);N("aria-label",t.closeAriaLabel),n(),h(t.closeIcon?1:-1),n(),h(t.closeIconTemplate||t._closeIconTemplate?2:-1),n(),h(!t.closeIconTemplate&&!t._closeIconTemplate&&!t.closeIcon?3:-1)}}function Dt(e,a){if(e&1&&(c(0,"div",1)(1,"div",2),g(2,xt,1,1,"ng-container")(3,_t,1,1,"i",3)(4,Ct,2,1,"div",4)(5,wt,1,1,"ng-template",null,0,be)(7,Mt,1,4,"ng-container")(8,St,2,1,"span",5)(9,Ft,4,4,"button",6),l()()),e&2){let t=ue(6),i=p();s("ngClass",i.containerClass)("@messageAnimation",Q(13,ht,he(10,ft,i.showTransitionOptions,i.hideTransitionOptions))),N("aria-live","polite")("role","alert"),n(2),h(i.iconTemplate||i._iconTemplate?2:-1),n(),h(i.icon?3:-1),n(),s("ngIf",!i.escape)("ngIfElse",t),n(3),h(i.containerTemplate||i._containerTemplate?7:8),n(2),h(i.closable?9:-1)}}var jt=({dt:e})=>`
.p-message {
    border-radius: ${e("message.border.radius")};
    outline-width: ${e("message.border.width")};
    outline-style: solid;
}

.p-message-content {
    display: flex;
    align-items: center;
    padding: ${e("message.content.padding")};
    gap: ${e("message.content.gap")};
    height: 100%;
}

.p-message-icon {
    flex-shrink: 0;
}

.p-message-close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-inline-start: auto;
    overflow: hidden;
    position: relative;
    width: ${e("message.close.button.width")};
    height: ${e("message.close.button.height")};
    border-radius: ${e("message.close.button.border.radius")};
    background: transparent;
    transition: background ${e("message.transition.duration")}, color ${e("message.transition.duration")}, outline-color ${e("message.transition.duration")}, box-shadow ${e("message.transition.duration")}, opacity 0.3s;
    outline-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
    cursor: pointer;
    user-select: none;
}

.p-message-close-icon {
    font-size: ${e("message.close.icon.size")};
    width: ${e("message.close.icon.size")};
    height: ${e("message.close.icon.size")};
}

.p-message-close-button:focus-visible {
    outline-width: ${e("message.close.button.focus.ring.width")};
    outline-style: ${e("message.close.button.focus.ring.style")};
    outline-offset: ${e("message.close.button.focus.ring.offset")};
}

.p-message-info {
    background: ${e("message.info.background")};
    outline-color: ${e("message.info.border.color")};
    color: ${e("message.info.color")};
    box-shadow: ${e("message.info.shadow")};
}

.p-message-info .p-message-close-button:focus-visible {
    outline-color: ${e("message.info.close.button.focus.ring.color")};
    box-shadow: ${e("message.info.close.button.focus.ring.shadow")};
}

.p-message-info .p-message-close-button:hover {
    background: ${e("message.info.close.button.hover.background")};
}

.p-message-info.p-message-outlined {
    color: ${e("message.info.outlined.color")};
    outline-color: ${e("message.info.outlined.border.color")};
}

.p-message-info.p-message-simple {
    color: ${e("message.info.simple.color")};
}

.p-message-success {
    background: ${e("message.success.background")};
    outline-color: ${e("message.success.border.color")};
    color: ${e("message.success.color")};
    box-shadow: ${e("message.success.shadow")};
}

.p-message-success .p-message-close-button:focus-visible {
    outline-color: ${e("message.success.close.button.focus.ring.color")};
    box-shadow: ${e("message.success.close.button.focus.ring.shadow")};
}

.p-message-success .p-message-close-button:hover {
    background: ${e("message.success.close.button.hover.background")};
}

.p-message-success.p-message-outlined {
    color: ${e("message.success.outlined.color")};
    outline-color: ${e("message.success.outlined.border.color")};
}

.p-message-success.p-message-simple {
    color: ${e("message.success.simple.color")};
}

.p-message-warn {
    background: ${e("message.warn.background")};
    outline-color: ${e("message.warn.border.color")};
    color: ${e("message.warn.color")};
    box-shadow: ${e("message.warn.shadow")};
}

.p-message-warn .p-message-close-button:focus-visible {
    outline-color: ${e("message.warn.close.button.focus.ring.color")};
    box-shadow: ${e("message.warn.close.button.focus.ring.shadow")};
}

.p-message-warn .p-message-close-button:hover {
    background: ${e("message.warn.close.button.hover.background")};
}

.p-message-warn.p-message-outlined {
    color: ${e("message.warn.outlined.color")};
    outline-color: ${e("message.warn.outlined.border.color")};
}

.p-message-warn.p-message-simple {
    color: ${e("message.warn.simple.color")};
}

.p-message-error {
    background: ${e("message.error.background")};
    outline-color: ${e("message.error.border.color")};
    color: ${e("message.error.color")};
    box-shadow: ${e("message.error.shadow")};
}

.p-message-error .p-message-close-button:focus-visible {
    outline-color: ${e("message.error.close.button.focus.ring.color")};
    box-shadow: ${e("message.error.close.button.focus.ring.shadow")};
}

.p-message-error .p-message-close-button:hover {
    background: ${e("message.error.close.button.hover.background")};
}

.p-message-error.p-message-outlined {
    color: ${e("message.error.outlined.color")};
    outline-color: ${e("message.error.outlined.border.color")};
}

.p-message-error.p-message-simple {
    color: ${e("message.error.simple.color")};
}

.p-message-secondary {
    background: ${e("message.secondary.background")};
    outline-color: ${e("message.secondary.border.color")};
    color: ${e("message.secondary.color")};
    box-shadow: ${e("message.secondary.shadow")};
}

.p-message-secondary .p-message-close-button:focus-visible {
    outline-color: ${e("message.secondary.close.button.focus.ring.color")};
    box-shadow: ${e("message.secondary.close.button.focus.ring.shadow")};
}

.p-message-secondary .p-message-close-button:hover {
    background: ${e("message.secondary.close.button.hover.background")};
}

.p-message-secondary.p-message-outlined {
    color: ${e("message.secondary.outlined.color")};
    outline-color: ${e("message.secondary.outlined.border.color")};
}

.p-message-secondary.p-message-simple {
    color: ${e("message.secondary.simple.color")};
}

.p-message-contrast {
    background: ${e("message.contrast.background")};
    outline-color: ${e("message.contrast.border.color")};
    color: ${e("message.contrast.color")};
    box-shadow: ${e("message.contrast.shadow")};
}

.p-message-contrast .p-message-close-button:focus-visible {
    outline-color: ${e("message.contrast.close.button.focus.ring.color")};
    box-shadow: ${e("message.contrast.close.button.focus.ring.shadow")};
}

.p-message-contrast .p-message-close-button:hover {
    background: ${e("message.contrast.close.button.hover.background")};
}

.p-message-contrast.p-message-outlined {
    color: ${e("message.contrast.outlined.color")};
    outline-color: ${e("message.contrast.outlined.border.color")};
}

.p-message-contrast.p-message-simple {
    color: ${e("message.contrast.simple.color")};
}

.p-message-text {
    display: inline-flex;
    align-items: center;
    font-size: ${e("message.text.font.size")};
    font-weight: ${e("message.text.font.weight")};
}

.p-message-icon {
    font-size: ${e("message.icon.size")};
    width: ${e("message.icon.size")};
    height: ${e("message.icon.size")};
}

.p-message-enter-from {
    opacity: 0;
}

.p-message-enter-active {
    transition: opacity 0.3s;
}

.p-message.p-message-leave-from {
    max-height: 1000px;
}

.p-message.p-message-leave-to {
    max-height: 0;
    opacity: 0;
    margin: 0;
}

.p-message-leave-active {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1), opacity 0.3s, margin 0.3s;
}

.p-message-leave-active .p-message-close-button {
    opacity: 0;
}

.p-message-sm .p-message-content {
    padding: ${e("message.content.sm.padding")};
}

.p-message-sm .p-message-text {
    font-size: ${e("message.text.sm.font.size")};
}

.p-message-sm .p-message-icon {
    font-size: ${e("message.icon.sm.size")};
    width: ${e("message.icon.sm.size")};
    height: ${e("message.icon.sm.size")};
}

.p-message-sm .p-message-close-icon {
    font-size: ${e("message.close.icon.sm.size")};
    width: ${e("message.close.icon.sm.size")};
    height: ${e("message.close.icon.sm.size")};
}

.p-message-lg .p-message-content {
    padding: ${e("message.content.lg.padding")};
}

.p-message-lg .p-message-text {
    font-size: ${e("message.text.lg.font.size")};
}

.p-message-lg .p-message-icon {
    font-size: ${e("message.icon.lg.size")};
    width: ${e("message.icon.lg.size")};
    height: ${e("message.icon.lg.size")};
}

.p-message-lg .p-message-close-icon {
    font-size: ${e("message.close.icon.lg.size")};
    width: ${e("message.close.icon.lg.size")};
    height: ${e("message.close.icon.lg.size")};
}

.p-message-outlined {
    background: transparent;
    outline-width: ${e("message.outlined.border.width")};
}

.p-message-simple {
    background: transparent;
    outline-color: transparent;
    box-shadow: none;
}

.p-message-simple .p-message-content {
    padding: ${e("message.simple.content.padding")};
}

.p-message-outlined .p-message-close-button:hover,
.p-message-simple .p-message-close-button:hover {
    background: transparent;
}`,Ot={root:({props:e})=>["p-message p-component p-message-"+e.severity,{"p-message-simple":e.variant==="simple"}],content:"p-message-content",icon:"p-message-icon",text:"p-message-text",closeButton:"p-message-close-button",closeIcon:"p-message-close-icon"},rt=(()=>{class e extends Ee{name="message";theme=jt;classes=Ot;static \u0275fac=(()=>{let t;return function(o){return(t||(t=z(e)))(o||e)}})();static \u0275prov=w({token:e,factory:e.\u0275fac})}return e})();var Y=(()=>{class e extends Fe{severity="info";text;escape=!0;style;styleClass;closable=!1;icon;closeIcon;life;showTransitionOptions="300ms ease-out";hideTransitionOptions="200ms cubic-bezier(0.86, 0, 0.07, 1)";size;variant;onClose=new ne;get closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}get containerClass(){let t=this.variant==="outlined"?"p-message-outlined":this.variant==="simple"?"p-message-simple":"",i=this.size==="small"?"p-message-sm":this.size==="large"?"p-message-lg":"";return`p-message-${this.severity} ${t} ${i}`.trim()+(this.styleClass?" "+this.styleClass:"")}visible=ae(!0);_componentStyle=k(rt);containerTemplate;iconTemplate;closeIconTemplate;templates;_containerTemplate;_iconTemplate;_closeIconTemplate;ngOnInit(){super.ngOnInit(),this.life&&setTimeout(()=>{this.visible.set(!1)},this.life)}ngAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"container":this._containerTemplate=t.template;break;case"icon":this._iconTemplate=t.template;break;case"closeicon":this._closeIconTemplate=t.template;break}})}close(t){this.visible.set(!1),this.onClose.emit({originalEvent:t})}static \u0275fac=(()=>{let t;return function(o){return(t||(t=z(e)))(o||e)}})();static \u0275cmp=E({type:e,selectors:[["p-message"]],contentQueries:function(i,o,m){if(i&1&&(x(m,mt,4),x(m,dt,4),x(m,gt,4),x(m,ze,4)),i&2){let r;_(r=y())&&(o.containerTemplate=r.first),_(r=y())&&(o.iconTemplate=r.first),_(r=y())&&(o.closeIconTemplate=r.first),_(r=y())&&(o.templates=r)}},inputs:{severity:"severity",text:"text",escape:[2,"escape","escape",P],style:"style",styleClass:"styleClass",closable:[2,"closable","closable",P],icon:"icon",closeIcon:"closeIcon",life:"life",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",size:"size",variant:"variant"},outputs:{onClose:"onClose"},features:[H([rt]),L],ngContentSelectors:ut,decls:1,vars:1,consts:[["escapeOut",""],[1,"p-message","p-component",3,"ngClass"],[1,"p-message-content"],[1,"p-message-icon",3,"ngClass"],[4,"ngIf","ngIfElse"],[3,"ngClass"],["pRipple","","type","button",1,"p-message-close-button"],[4,"ngTemplateOutlet"],[3,"ngClass","innerHTML",4,"ngIf"],[3,"ngClass","innerHTML"],[3,"ngClass",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["pRipple","","type","button",1,"p-message-close-button",3,"click"],[1,"p-message-close-icon",3,"ngClass"],["styleClass","p-message-close-icon"]],template:function(i,o){i&1&&(de(),g(0,Dt,10,15,"div",1)),i&2&&h(o.visible()?0:-1)},dependencies:[O,_e,j,Ce,De,je,B],encapsulation:2,data:{animation:[qe("messageAnimation",[Z(":enter",[U({opacity:0,transform:"translateY(-25%)"}),G("{{showTransitionParams}}")]),Z(":leave",[G("{{hideTransitionParams}}",U({height:0,marginTop:0,marginBottom:0,marginLeft:0,marginRight:0,opacity:0}))])])]},changeDetection:0})}return e})(),lt=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=F({type:e});static \u0275inj=I({imports:[Y,B,B]})}return e})();var ct=(()=>{class e{constructor(t){this.http=t,this.formSubmitUrl="https://formsubmit.co/ajax/683271139b5b85d710db6ff2ad2c22d6"}send(t){return this.http.post(this.formSubmitUrl,{name:t.name,email:t.email,message:t.message,_subject:"GoTiva Contact Request",_template:"table",_captcha:!1},{headers:{"Content-Type":"application/json",Accept:"application/json"}})}static{this.\u0275fac=function(i){return new(i||e)(te(we))}}static{this.\u0275prov=w({token:e,factory:e.\u0275fac,providedIn:"root"})}}return e})();function At(e,a){if(e&1&&d(0,"map-advanced-marker",26),e&2){let t=a.$implicit;s("position",t.position)("content",t.content)("gmpDraggable",!1)}}function qt(e,a){if(e&1&&(ce(0),c(1,"google-map",24),g(2,At,1,3,"map-advanced-marker",25),l(),pe()),e&2){let t=p();n(),s("options",t.mapOptions),n(),s("ngForOf",t.markers)("ngForTrackBy",t.trackBy)}}function Vt(e,a){e&1&&(d(0,"p-message",11),u(1,"translate")),e&2&&s("text",f(1,1,"components.contact.successMessage"))}function Lt(e,a){e&1&&(d(0,"p-message",12),u(1,"translate")),e&2&&s("text",f(1,1,"components.contact.errorMessage"))}var Bi=(()=>{class e{constructor(t,i,o,m,r,q){this._cdr=t,this._googleMapsLoader=i,this._fb=o,this.contactService=m,this.translate=r,this.localization=q,this.markers=[],this.sending=!1,this.submitSuccess=!1,this.submitError=!1,this.success=!1,this.layoutService=k(Me),this.isDarkTheme=xe(()=>this.layoutService.isDarkTheme()),this.errorMessages={},this._destroy$=new K,this._showMapSubject=new W(!1),this.showMap$=this._showMapSubject.asObservable(),this.mapOptions={center:{lat:55.74218032609179,lng:37.62001671463327},zoom:16,disableDefaultUI:!0,minZoom:3,mapId:"a870aaade7ac6f22",styles:[{featureType:"landscape.natural.landcover",elementType:"geometry.fill",stylers:[{color:"#1bbc9b"}]}],gestureHandling:"greedy",scrollwheel:!0,colorScheme:this.layoutService.config().darkTheme?"DARK":"LIGHT",clickableIcons:!1},this.buildForm(),this._watchForMapAPILoadChanges()}_watchForMapAPILoadChanges(){this._googleMapsLoader.apiLoaded$.pipe(ee(0),S(this._destroy$)).subscribe(()=>{this._showMapSubject.next(!1),X(0).pipe(S(this._destroy$)).subscribe(()=>{this._showMapSubject.next(!0);let t=[37.62001671463327,55.74218032609179],i=this.buildMarker(ot(t,{name:"Ankara Avenue, 405 "}),"A","#E94435");this.markers.push(i),this._cdr.markForCheck()})})}ngOnInit(){this.errorMessages={minlength:t=>this.translate.instant("components.contact.validation.minlength",{length:t.requiredLength}),pattern:()=>this.translate.instant("components.contact.validation.invalidEmail"),required:()=>this.translate.instant("components.contact.validation.required")},this.localization.languageChanged$.pipe(J(t=>t.lang),S(this._destroy$)).subscribe(t=>{this._googleMapsLoader.reloadWithNewLanguage(t)})}onSubmit(){this.form.invalid||this.sending||(this.submitSuccess=!1,this.submitError=!1,this.sending=!0,this.contactService.send(this.form.getRawValue()).subscribe({next:()=>{this.submitSuccess=!0,this.form.reset(),this.sending=!1},error:()=>{this.submitError=!0,this.sending=!1}}))}buildForm(){this.form=this._fb.group({name:new R(null,[C.required]),message:new R(null,[C.required]),email:new R(null,[C.required,C.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),C.email])})}trackBy(t,i){return i.label}buildMarker(t,i,o){let[m,r]=t.geometry.coordinates;return{feature:t,label:i,position:{lat:r,lng:m},content:this.createMarkerContent("assets/images/maps/destination.svg")}}createMarkerContent(t){let i=document.createElement("img");return i.src=t,i.alt="Marker",Object.assign(i.style,{width:"44px",height:"44px",display:"block",pointerEvents:"auto"}),i}static{this.\u0275fac=function(i){return new(i||e)(b(ve),b(nt),b(Ue),b(ct),b(Se),b(Re))}}static{this.\u0275cmp=E({type:e,selectors:[["app-contact"]],decls:42,vars:39,consts:[[3,"styleClass"],[1,"pt-20"],[3,"title"],[1,"contact-page"],[1,"container"],[1,"grid","lg:grid-cols-2","items-center","gap-10"],["data-wow-delay","100ms",1,"wow","fadeInUp"],[1,"h-[400px]","w-full","overflow-hidden","rounded-[24px]"],[4,"ngIf"],["data-wow-delay","200ms",1,"wow","fadeInRight"],[1,"contact-page__form","contact-form-validated","form-one",3,"ngSubmit","formGroup"],["severity","success","styleClass","mb-6 w-full",3,"text"],["severity","error","styleClass","mb-6 w-full",3,"text"],[1,"form-one__group"],[1,"form-one__control",3,"appFieldValidation"],["for","name",1,"dark:text-surface-0!"],["pInputText","","formControlName","name","id","name","type","text","name","name",3,"placeholder"],["for","email",1,"dark:text-surface-0!"],["pInputText","","formControlName","email","id","email","type","email","name","email",3,"placeholder"],[1,"form-one__control","form-one__control--full",3,"appFieldValidation"],["for","message",1,"dark:text-surface-0!"],["formControlName","message","id","message","name","message",3,"placeholder"],[1,"form-one__control","form-one__control--full"],["type","submit","aria-label","Send Messages","size","large",3,"loading","disabled","label"],["height","100%","width","100%",3,"options"],[3,"position","content","gmpDraggable",4,"ngFor","ngForOf","ngForTrackBy"],[3,"position","content","gmpDraggable"]],template:function(i,o){i&1&&(c(0,"animated-container"),d(1,"app-menu",0),c(2,"div",1)(3,"app-header",2),u(4,"translate"),v(5),u(6,"translate"),l(),c(7,"section",3)(8,"div",4)(9,"div",5)(10,"div",6)(11,"div",7),g(12,qt,3,3,"ng-container",8),u(13,"async"),l()(),c(14,"div",9)(15,"form",10),T("ngSubmit",function(){return o.onSubmit()}),g(16,Vt,2,3,"p-message",11)(17,Lt,2,3,"p-message",12),c(18,"div",13)(19,"div",14)(20,"label",15),v(21),u(22,"translate"),l(),d(23,"input",16),u(24,"translate"),l(),c(25,"div",14)(26,"label",17),v(27),u(28,"translate"),l(),d(29,"input",18),u(30,"translate"),l(),c(31,"div",19)(32,"label",20),v(33),u(34,"translate"),l(),c(35,"textarea",21),u(36,"translate"),v(37,"                                    "),l()(),c(38,"div",22),d(39,"p-button",23),u(40,"translate"),l()()()()()()(),d(41,"app-footer"),l()()),i&2&&(n(),s("styleClass","relative! w-full! p-0! border-0 rounded-none! bg-transparent"),n(2),s("title",f(4,19,"components.contact.title")),n(2),M(" ",f(6,21,"components.contact.description")," "),n(7),s("ngIf",f(13,23,o.showMap$)),n(3),s("formGroup",o.form),n(),h(o.submitSuccess?16:-1),n(),h(o.submitError?17:-1),n(2),s("appFieldValidation",o.errorMessages),n(2),M(" ",f(22,25,"components.contact.fullName")," "),n(2),s("placeholder",f(24,27,"components.contact.enterName")),n(2),s("appFieldValidation",o.errorMessages),n(2),M(" ",f(28,29,"components.contact.email")," "),n(2),s("placeholder",f(30,31,"components.contact.enterEmail")),n(2),s("appFieldValidation",o.errorMessages),n(2),M(" ",f(34,33,"components.contact.message")," "),n(2),s("placeholder",f(36,35,"components.contact.writeMessage")),n(4),s("loading",o.sending)("disabled",o.sending||o.form.invalid)("label",f(40,37,"components.contact.sendMessage")))},dependencies:[O,ye,j,$e,Te,Je,Xe,Ae,it,et,tt,Be,Oe,We,Ke,st,Ye,Qe,Ve,Ne,He,Pe,Ge,Ze,ke,Ie,at,lt,Y],encapsulation:2})}}return e})();export{Bi as ContactComponent};
