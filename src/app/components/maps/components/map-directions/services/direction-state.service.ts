import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IDirectionState } from '../interfaces/direction-state.interface';
import { initialState } from '../constants/initial-state.constant';
import { Feature, Point } from 'geojson';

@Injectable({ providedIn: 'root' })
export class DirectionStateService {
  private stateSubject = new BehaviorSubject<IDirectionState>({ ...initialState });
  public state$: Observable<IDirectionState> = this.stateSubject.asObservable();
  private _fitBoundsTrigger$ = new Subject<void>();
  readonly fitBoundsTrigger$ = this._fitBoundsTrigger$.asObservable();

  public getState(): IDirectionState {
    return this.stateSubject.getValue();
  }

  public requestFitBounds(): void {
    this._fitBoundsTrigger$.next();
  }

  private update(partial: Partial<IDirectionState>): void {
    this.stateSubject.next({ ...this.getState(), ...partial });
  }

  public setOrigin(origin: Feature<Point>): void {
    this.update({ origin, error: undefined });
  }

  public setDestination(destination: Feature<Point>): void {
    this.update({ destination, error: undefined });
  }

  public setWaypoints(waypoints: Feature<Point>[]): void {
    this.update({ waypoints, error: undefined });
  }


  public setRoutes(routes: google.maps.DirectionsRoute[]): void {
    this.update({ routes, error: undefined });
  }

  public selectRoute(index: number): void {
    this.update({ selectedRouteIndex: index });
  }

  public setError(error: string): void {
    console.error(error);
    this.update({ error, routes: [] });
  }

  public clear(): void {
    this.stateSubject.next({ ...initialState });
  }

  public clearOrigin(): void {
    this.update({ origin: undefined, routes: [] });
  }

  public clearDestination(): void {
    this.update({ destination: undefined, routes: [] });
  }

  public clearWaypoints(): void {
    this.update({ waypoints: undefined, routes: [] });
  }
}