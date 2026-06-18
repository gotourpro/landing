import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { twMerge } from "tailwind-merge";
import { StyleClassModule } from "primeng/styleclass";
//  import { AppLogo } from "./app.logo";

// @Component({
//   selector: "app-navbar",
//   standalone: true,
//   imports: [CommonModule, RouterModule, StyleClassModule, RouterLink,],
//   template: ` <nav
//     [class]="
//       twMerge(
//         'flex items-center relative z-[99999] justify-between py-6 w-[calc(100%-3rem)] max-h-[75px] mx-auto border-b border-white/10 border-dashed',
//         className
//       )
//     "
//   >
//     <a routerLink="/">
    
//     </a>
//     <ul class="hidden lg:flex items-center gap-3">
//       <li *ngFor="let data of navbarData; let i = index">
//         <a
//           pStyleClass="@next"
//           enterFromClass="hidden"
//           enterActiveClass="animate-fadein"
//           leaveActiveClass="animate-fadeout"
//           leaveToClass="hidden"
//           [hideOnOutsideClick]="true"
//           class="inline-flex items-center gap-2 rounded-full py-1 pr-2 pl-3 select-none transition-all cursor-pointer text-white/72 hover:text-white hover:bg-white/8 hover:shadow-[0px_10px_10px_-8px_rgba(18,18,23,0.02),0px_2px_2px_-1.5px_rgba(18,18,23,0.02),0px_1px_1px_-0.5px_rgba(18,18,23,0.02),0px_0px_0px_1px_rgba(18,18,23,0.02)] group-data-[open=true]:!bg-white/16 group-data-[open=true]:!text-white group-data-[open=true]:!backdrop-blur-2xl border border-white/0 group-data-[open=true]:!border-white/4 group-data-[open=true]:!shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]"
//         >
//           <span class="text-base">{{ data.title }}</span>
//           <i class="pi pi-chevron-down !text-xs"></i>
//         </a>
//         <div
//           class="hidden absolute top-[calc(100%-1rem)] z-[999999] max-w-40 w-full flex flex-col transition-all ease-in-out duration-100 p-2 gap-2 rounded-lg shadow-stroke dark:shadow-none border-0 dark:border border-white/12 bg-surface-0"
//         >
//           <a
//             *ngFor="let item of data.content; let index = index"
//             [routerLink]="item.to"
//             class="w-full text-left py-2 px-3 rounded-lg transition-all font-medium"
//             [ngClass]="{
//               'text-surface-950 bg-surface-200': item.to === pathname,
//               'text-surface-500 hover:text-surface-950 hover:bg-surface-200':
//                 item.to !== pathname,
//             }"
//           >
//             {{ item.label }}
//           </a>
//         </div>
//       </li>
//     </ul>
//     <ul class="hidden lg:flex items-center">
//       <li>
//         <a routerLink="/second-pages/signup" class="button-regular">
//           Sign Up
//         </a>
//       </li>
//     </ul>
//     <div class="relative lg:hidden block">
//       <a
//         pStyleClass="@next"
//         enterFromClass="hidden"
//         enterActiveClass="animate-scalein"
//         leaveActiveClass="animate-fadeout"
//         leaveToClass="hidden"
//         [hideOnOutsideClick]="true"
//         class="w-10 h-10 cursor-pointer inline-flex items-center justify-center rounded-full bg-surface-0 text-surface-950 hover:bg-surface-200"
//       >
//         <i class="pi pi-bars"></i>
//       </a>
//       <div
//         class="hidden absolute top-[calc(100%+0.5rem)] max-h-96 overflow-auto left-auto !right-0 w-60 p-2 rounded-2xl shadow-blue-card flex flex-col bg-surface-0"
//       >
//         <div class="flex flex-col">
//           <div *ngFor="let data of navbarData" class="mt-4">
//             <span class="px-3 !py-2 text-surface-950 font-medium">{{
//               data.title
//             }}</span>
//             <div class="flex flex-col gap-1 my-2">
//               <a
//                 *ngFor="let item of data.content; let index = index"
//                 [routerLink]="item.to"
//                 class="py-2 px-3 rounded-lg hover:bg-surface-200 font-medium text-surface-500 hover:text-surface-950"
//               >
//                 {{ item.label }}
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </nav>`,
// })
// export class AppNavbar {
//   @Input() className?: string;

//   pathname: string;

//   constructor(private router: Router) {
//     this.pathname = this.router.url;
//   }

//   twMerge = twMerge;

//   navbarData = [
//     {
//       id: "landings",
//       title: "Landings",
//       content: [
//         { label: "Travel", to: "/" },
//         { label: "SaaS", to: "/saas" },
//         { label: "Startup", to: "/startup" },
//         { label: "Enterprise", to: "/enterprise" },
//         { label: "E-Learning", to: "/e-learning" },
//         { label: "Real Estate", to: "/real-estate" },
//         { label: "Logistics", to: "/logistic" },
//         { label: "Agency", to: "/agency" },
//       ],
//     },
//     {
//       id: "second_pages",
//       title: "Secondary Pages",
//       content: [
//         { label: "About", to: "/second-pages/about" },
//         { label: "Pricing", to: "/second-pages/pricing" },
//         { label: "Blog", to: "/second-pages/blog" },
//         { label: "Blog Detail", to: "/second-pages/blog/detail" },
//         { label: "Contact", to: "/second-pages/contact" },
//       ],
//     },
//     {
//       id: "account_pages",
//       title: "Account Pages",
//       content: [
//         { label: "Sign Up", to: "/second-pages/signup" },
//         { label: "Sign In", to: "/second-pages/signin" },
//         { label: "Error", to: "/404" },
//         { label: "Password Reset", to: "/second-pages/reset-password" },
//         { label: "Account General", to: "/second-pages/account" },
//       ],
//     },
//   ];
// }
