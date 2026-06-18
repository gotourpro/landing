import { IDirectionState } from "../interfaces/direction-state.interface";
export const initialState: IDirectionState = {
  origin: undefined,
  destination: undefined,
  center:undefined,
  waypoints: [],
  routes: [],
  selectedRouteIndex: 0,
  provideRouteAlternatives:false,
  error: undefined,
};