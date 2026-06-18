import { LoaderOptions } from '@googlemaps/js-api-loader';

export interface IGoogleMapsConfig {
  loader: LoaderOptions;
  style: google.maps.Data.StyleOptions;
}