import { FormControl } from "@angular/forms";

export interface IToolbarSearchAction {
  placeholder?: string;
  disabled?: boolean;
  tooltipText?: string;
  icon?: string;
  action?: (event: any) => void;
  visible?: boolean;
  control: FormControl;
}