import { ColumnFilter } from "primeng/table";

export interface ICustomColumnFilterOptions extends Partial<ColumnFilter> {
  view?: 'row' | 'overlay';
}