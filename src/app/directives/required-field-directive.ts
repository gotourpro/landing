import { Directive, ElementRef, Renderer2, AfterViewInit, Input } from '@angular/core';
import { NgControl, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appRequiredField]'
})
export class RequiredFieldDirective implements AfterViewInit {

  @Input() appRequiredFieldErrorMessages: { [key: string]: string | ((error: any) => string) };

  private defaultErrorMessages = {
    required: 'This field is required',
    minlength: (error: any) => `The field value must be: from ${error.requiredLength} characters`,
    maxlength: (error: any) => `The field value must be: no more than ${error.requiredLength} characters`,
    pattern: (error: any) => 'Enter date in dd.mm.yyyy hh:mm format'
  };

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  public ngAfterViewInit(): void {
    this.addRequiredStar();
    if (this.control && this.control.control) {

      
      this.control.control.statusChanges.subscribe(() => {
        this.displayError();
      });
    }
  }

  private isRequired(): boolean {
    const inputElement = this.el.nativeElement;
    if (inputElement.hasAttribute('required')) {
      return true;
    }
    if (this.control && this.control.control && this.control.control.validator) {
      const testControl = { value: null } as AbstractControl;
      const result = this.control.control.validator(testControl);
      if (result && result['required']) {
        return true;
      }
    }
    return false;
  }

  private getControlId(): string | null {
    const inputElement = this.el.nativeElement;
    return inputElement.getAttribute('id') || inputElement.getAttribute('inputId');
  }

  private addRequiredStar(): void {
    if (!this.isRequired()) {
      return;
    }

    const id = this.getControlId();
    if (id) {
      // First, we try to find the label associated with this input using `for="id"`
      const parent = this.el.nativeElement.closest('div'); // Look for the parent container
      const label = parent ? parent.querySelector(`label[for="${id}"]`) : null;

      if (label && !label.querySelector('.required-star')) {
        // If label is found, append the star inside it
        const star = this.renderer.createElement('small');
        this.renderer.addClass(star, 'required-star');
        this.renderer.setStyle(star, 'color', 'var(--p-red-400)');
        this.renderer.setStyle(star, 'margin-left', '5px');
        const starText = this.renderer.createText('*');
        this.renderer.appendChild(star, starText);
        this.renderer.appendChild(label, star);
      } else {
        // If label is not found, try to append the star inside `p-inputgroup`
        const inputGroup = parent.querySelector('p-inputgroup');
        if (inputGroup && !inputGroup.querySelector('.required-star')) {
          const star = this.renderer.createElement('small');
          this.renderer.addClass(star, 'required-star');
          this.renderer.setStyle(star, 'color', 'var(--p-red-400)');
          this.renderer.setStyle(star, 'margin-left', '5px');
          const starText = this.renderer.createText('*');
          this.renderer.appendChild(star, starText);
          this.renderer.appendChild(inputGroup, star); // Append inside `p-inputgroup`
        }
      }
    }
  }

  private displayError(): void {
    const control = this.control.control;
    const inputElement = this.el.nativeElement;
    const parent = inputElement.parentElement;
    if (!parent) {
      return;
    }

    let errorElem = parent.querySelector('.required-error');

    if (control && control.invalid && (control.dirty || control.touched)) {
      const errors = control.errors;
      const errorKeys = errors ? Object.keys(errors) : [];
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        let message: string;
        if (
          this.appRequiredFieldErrorMessages &&
          this.appRequiredFieldErrorMessages[firstErrorKey]
        ) {
          const customMessage = this.appRequiredFieldErrorMessages[firstErrorKey];
          message =
            typeof customMessage === 'function'
              ? customMessage(errors![firstErrorKey])
              : customMessage;
        } else if (this.defaultErrorMessages[firstErrorKey]) {
          const defaultMessage = this.defaultErrorMessages[firstErrorKey];
          message =
            typeof defaultMessage === 'function'
              ? defaultMessage(errors![firstErrorKey])
              : defaultMessage;
        } else {
          message = 'Некорректное значение';
        }

        // Create the div container with absolute positioning
        let errorContainer = parent.querySelector('.required-error-container');
        if (!errorContainer) {
          errorContainer = this.renderer.createElement('div');
          this.renderer.addClass(errorContainer, 'required-error-container');
          this.renderer.setStyle(parent, 'position', 'relative');
          this.renderer.setStyle(errorContainer, 'position', 'absolute');
          this.renderer.setStyle(errorContainer, 'top', '100%');
          this.renderer.setStyle(errorContainer, 'left', '0');
          this.renderer.setStyle(errorContainer, 'width', '100%');
          this.renderer.setStyle(errorContainer, 'z-index', '10');
          this.renderer.appendChild(parent, errorContainer);
        }

        // Create the <small> error message inside the div
        if (!errorElem) {
          errorElem = this.renderer.createElement('small');
          this.renderer.addClass(errorElem, 'required-error');
          this.renderer.setStyle(errorElem, 'color', 'var(--p-red-400)');
          this.renderer.setStyle(errorElem, 'font-size', '12px');
          this.renderer.appendChild(errorContainer, errorElem);
        }
        this.renderer.setProperty(errorElem, 'innerText', message);
      }
    } else {
      if (errorElem) {
        this.renderer.removeChild(parent, errorElem);
      }
    }
  }
}
