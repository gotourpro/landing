import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { IToolbarSearchAction } from '../interfaces/toolbar-action.interface';

@Injectable({ providedIn: 'root' })

export class ToolbarSearchService {
  
  private readonly _default: IToolbarSearchAction = {
    placeholder: 'Search',
    disabled: false,
    tooltipText: 'Search',
    icon: '',
    visible: true,
    control: new FormControl(''),
    action: (value) => console.log('Search:', value),
  };

  public search$ = new BehaviorSubject<IToolbarSearchAction | null>(null);

  get search(): IToolbarSearchAction {
    return this.search$?.value!;
  }

  public setSearch(action: IToolbarSearchAction): void {
    this.search$?.next(action);
  }

  public setSearchValue(value: string): void {
    this.search?.control?.setValue(value);
  }

  public reset(): void {
    this.search?.control?.reset();
  }

}
