import { Injectable } from '@angular/core';
import { ITableState } from '../interfaces/table-state.interface';

@Injectable({
  providedIn: 'root'
})
export class TableStateService {

  loadState(stateKey: string, defaultState: ITableState): ITableState {
    const stored = localStorage.getItem(stateKey);
    if (stored) {
      try {
        return JSON.parse(stored) as ITableState;
      } catch (error) {
        console.error('Ошибка парсинга состояния таблицы из localStorage', error);
      }
    }
    this.saveState(stateKey, defaultState);
    return defaultState;
  }


  saveState(stateKey: string, state: ITableState): void {
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  updateState(stateKey: string, partialState: Partial<ITableState>, defaultState: ITableState): ITableState {
    const currentState = this.loadState(stateKey, defaultState);
    const mergedState: ITableState = {
      ...currentState,
      ...partialState
    };
    this.saveState(stateKey, mergedState);
    return mergedState;
  }

  clearState(stateKey: string): void {
    localStorage.removeItem(stateKey);
  }
}
