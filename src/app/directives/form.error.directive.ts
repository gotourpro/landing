import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFormError]',
  standalone:true,
})
export class FormErrorDirective implements OnInit {
  @Input('appFormError') controlName!: string;
  @Input() formGroup!: FormGroup;
  @Input() errorMessage: string = 'This field is required.';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    const control = this.formGroup.get(this.controlName);

    if (control) {
      control.statusChanges.subscribe(() => {
        this.updateView(control);
      });

      this.updateView(control);
    }
  }

  private updateView(control: AbstractControl) {
    this.viewContainer.clear();

    if (control.invalid && control.touched) {
      const context = {
        $implicit: this.errorMessage,
        errors: control.errors
      };
      this.viewContainer.createEmbeddedView(this.templateRef, context);
    }
  }
}