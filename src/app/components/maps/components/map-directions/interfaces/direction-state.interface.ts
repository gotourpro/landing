import type { Feature, Point } from 'geojson';
export interface IDirectionState {
  origin?: Feature<Point>;
  destination?: Feature<Point>;
  center?: Feature<Point>,
  waypoints?: Feature<Point>[];
  routes: google.maps.DirectionsRoute[];
  selectedRouteIndex: number;
  provideRouteAlternatives: boolean;
  error?: string;
}