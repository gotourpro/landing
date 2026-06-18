import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { twMerge } from "tailwind-merge";
import { Trimzales } from "./icon/customers/trimzales";

@Component({
  selector: "floating-customers",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<div
  [ngClass]="
    twMerge(
      'w-full flex flex-nowrap gap-6 overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_white_128px,_white_calc(100%-128px),transparent_100%)]',
      className
    )
  "
>

  <ng-template #customerTemplate let-data>

    @if (data.url) {

      <a
        [href]="data.url"
        target="_blank"
        rel="noopener noreferrer"
        class="w-44 flex items-center flex-nowrap justify-center gap-4 transition-opacity hover:opacity-80"
      >
        <ng-container *ngIf="data.logo">
          <div [class]="twMerge('w-10 h-10 object-cover', iconClass)">
            <ng-container *ngComponentOutlet="data.logo"></ng-container>
          </div>
        </ng-container>

        <span
          [ngClass]="twMerge('font-semibold text-white/56 text-lg', labelClass)"
        >
          {{ data.label }}
        </span>
      </a>

    } @else {

      <div class="w-44 flex items-center flex-nowrap justify-center gap-4">

        <ng-container *ngIf="data.logo">
          <div [class]="twMerge('w-10 h-10 object-cover', iconClass)">
            <ng-container *ngComponentOutlet="data.logo"></ng-container>
          </div>
        </ng-container>

        <span
          [ngClass]="twMerge('font-semibold text-white/56 text-lg', labelClass)"
        >
          {{ data.label }}
        </span>

      </div>

    }

  </ng-template>

  @if (centerIfSingle && isSingleItem) {

    <div class="flex w-full justify-center items-center">

      <ng-container
        *ngTemplateOutlet="
          customerTemplate;
          context: { $implicit: floatingCustomersData[0] }
        "
      >
      </ng-container>

    </div>

  } @else {

    <div
      *ngFor="let i of [1, 2]"
      class="flex flex-nowrap items-center justify-center md:justify-start animate-infinite-scroll"
    >

      <ng-container *ngFor="let data of floatingCustomersData">

        <ng-container
          *ngTemplateOutlet="
            customerTemplate;
            context: { $implicit: data }
          "
        >
        </ng-container>

      </ng-container>

    </div>

  }

</div> `,
})
export class FloatingCustomers {
  @Input() className?: string;
  @Input() iconClass?: string;
  @Input() labelClass?: string;
  @Input() floatingCustomersData: any = [];

  @Input() centerIfSingle = true;
  twMerge = twMerge;

  get isSingleItem(): boolean {
    return this.floatingCustomersData.length === 1;
  }

}
