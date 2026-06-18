import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface MapPlaces {
  status: google.maps.places.PlacesServiceStatus;
  result: google.maps.places.PlaceResult | null;
}

@Injectable({ providedIn: 'root' })
export class MapPlacesService {
  private readonly _ngZone = inject(NgZone);
  private _placesService?: google.maps.places.PlacesService;


  public getDetails(
    map: google.maps.Map,
    request: google.maps.places.PlaceDetailsRequest
  ): Observable<MapPlaces> {
    return new Observable(observer => {
      this._getService(map).then(service => {
        service.getDetails(request, (place, status) => {
          this._ngZone.run(() => {
            observer.next({ result: place ?? null, status });
            observer.complete();
          });
        });
      });
    });
  }

  
  public nearbySearch(
    map: google.maps.Map,
    request: google.maps.places.PlaceSearchRequest
  ): Observable<{
    status: google.maps.places.PlacesServiceStatus;
    results: google.maps.places.PlaceResult[];
  }> {
    return new Observable(observer => {
      this._getService(map).then(service => {
        service.nearbySearch(request, (results, status) => {
          this._ngZone.run(() => {
            observer.next({ results: results ?? [], status });
            observer.complete();
          });
        });
      });
    });
  }

 
  public textSearch(
    map: google.maps.Map,
    request: any
  ): Observable<{
    status: google.maps.places.PlacesServiceStatus;
    results: google.maps.places.PlaceResult[];
  }> {
    return new Observable(observer => {
      this._getService(map).then(service => {
        service.textSearch(request, (results, status) => {
          this._ngZone.run(() => {
            observer.next({ results: results ?? [], status });
            observer.complete();
          });
        });
      });
    });
  }

  private _getService(
    map: google.maps.Map
  ): Promise<google.maps.places.PlacesService> {
    if (this._placesService) {
      return Promise.resolve(this._placesService);
    }

    if ((google.maps.places as any)?.PlacesService) {
      this._placesService = new google.maps.places.PlacesService(map);
      return Promise.resolve(this._placesService);
    }

    return google.maps
      .importLibrary('places')
      .then((lib: unknown) => {
        const placesLib = lib as typeof google.maps.places;
        this._placesService = new placesLib.PlacesService(map);
        return this._placesService;
      });
  }
}
