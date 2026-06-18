import { DatePickerViewConfig } from "../interfaces/date-picker-view";

export const DATE_VIEW_CONFIGS: Record<string, DatePickerViewConfig> = {
    dateIs: { view: 'date', selectionMode: 'single', dateFormat: 'dd-mm-yy' },
    dateBefore: { view: 'date', selectionMode: 'single', dateFormat: 'dd-mm-yy' },
    dateAfter: { view: 'date', selectionMode: 'single', dateFormat: 'dd-mm-yy' },
  
    monthIs: { view: 'month', selectionMode: 'single', dateFormat: 'mm-yy' },
    monthBefore: { view: 'month', selectionMode: 'single', dateFormat: 'mm-yy' },
    monthAfter: { view: 'month', selectionMode: 'single', dateFormat: 'mm-yy' },
  
    yearIs: { view: 'year', selectionMode: 'single', dateFormat: 'yy' },
    yearBefore: { view: 'year', selectionMode: 'single', dateFormat: 'yy' },
    yearAfter: { view: 'year', selectionMode: 'single', dateFormat: 'yy' },
  
    rangeBetweenDate: { view: 'date', selectionMode: 'range', dateFormat: 'dd-mm-yy' },
    rangeEqualsDate: { view: 'date', selectionMode: 'range', dateFormat: 'dd-mm-yy' },
  
    rangeBetweenMonth: { view: 'month', selectionMode: 'range', dateFormat: 'mm-yy' },
    rangeEqualsMonth: { view: 'month', selectionMode: 'range', dateFormat: 'mm-yy' },
  
    rangeBetweenYear: { view: 'year', selectionMode: 'range', dateFormat: 'yy' },
    rangeEqualsYear: { view: 'year', selectionMode: 'range', dateFormat: 'yy' },
  
    multipleDate: { view: 'date', selectionMode: 'multiple', dateFormat: 'dd-mm-yy' },
    multipleMonth: { view: 'month', selectionMode: 'multiple', dateFormat: 'mm-yy' },
    multipleYear: { view: 'year', selectionMode: 'multiple', dateFormat: 'yy' },
  };