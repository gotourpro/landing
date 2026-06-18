// direction.service.ts
import { inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { DirectionStateService } from './direction-state.service';
import { MapGeocoder, MapGeocoderResponse } from '@angular/google-maps';
import { Feature, Point } from 'geojson';
import { point } from "@turf/helpers";
@Injectable({ providedIn: 'root' })
// export class DirectionService {
//   private loadingSubject = new BehaviorSubject<boolean>(false);
//   public loading$ = this.loadingSubject.asObservable();

//   // Эмитим сюда полный Google DirectionsResult
//   private _directionsResult = new BehaviorSubject<google.maps.DirectionsResult | null>(null);
//   public directionsResult$ = this._directionsResult.asObservable();

//   private geocoder = inject(MapGeocoder);

//   constructor(
//     private state: DirectionStateService,
//     private ngZone: NgZone
//   ) {}

//   /**
//    * Вызывается компонентом, когда нужно получить новый маршрут
//    */
//   public fetchDirections(): void {
//     const s = this.state.getState();
//     if (!s.origin || !s.destination) {
//       this.state.setError('Origin and destination must be set.');
//       return;
//     }

//     // Преобразуем GeoJSON Feature<Point> в LatLngLiteral
//     const oCoords = s.origin.geometry.coordinates;
//     const dCoords = s.destination.geometry.coordinates;
//     const originLatLng: google.maps.LatLngLiteral = { lat: oCoords[1], lng: oCoords[0] };
//     const destinationLatLng: google.maps.LatLngLiteral = { lat: dCoords[1], lng: dCoords[0] };

//     const request: google.maps.DirectionsRequest = {
//       origin: originLatLng,
//       destination: destinationLatLng,
//       waypoints: s.waypoints?.map(wp => {
//         const c = wp.geometry.coordinates;
//         return { location: { lat: c[1], lng: c[0] }, stopover: true };
//       }),
//       travelMode: google.maps.TravelMode.DRIVING,
//       provideRouteAlternatives: s.provideRouteAlternatives,
//     };

//     this.loadingSubject.next(true);

//     google.maps
//       .importLibrary('routes')
//       .then((maps: any) => {
//         const svc = new maps.DirectionsService();
//         svc.route(request, (result, status) => {
//           this.ngZone.run(() => {
//             this.loadingSubject.next(false);

//             if (status === google.maps.DirectionsStatus.OK && result) {
//               this.state.setRoutes(result.routes);
//               this._directionsResult.next(result);
//             } else {
//               this.state.setError(result?.status || status);
//             }
//           });
//         });
//       })
//       .catch(err => {
//         this.ngZone.run(() => {
//           this.loadingSubject.next(false);
//           this.state.setError(`Failed to load directions library: ${err}`);
//         });
//       });
//   }

//   /**
//    * Геокодинг origin по placeId или установка прямо по координатам
//    */
//   public setOrigin(input: string | google.maps.LatLngLiteral | [number, number]): void {
//     if (typeof input === 'string') {
//       this.loadingSubject.next(true);
//       this.geocoder.geocode({ placeId: input }).subscribe({
//         next: (resp: MapGeocoderResponse) => {
//           this.loadingSubject.next(false);
//           const { results, status } = resp;
//           if (status === 'OK' && results.length) {
//             const r = results[0];
//             const feature: Feature<Point> = point(
//               [r.geometry.location.lng(), r.geometry.location.lat()],
//                 { placeId: r.place_id, name: r.formatted_address,description:r.formatted_address }
//             );
//             this.state.setOrigin(feature);
//           } else {
//             this.state.setError(`Geocode origin failed: ${status}`);
//           }
//         },
//         error: err => {
//           this.loadingSubject.next(false);
//           this.state.setError(`Geocode origin error: ${err}`);
//         }
//       });
//     } else {
//       const coords = Array.isArray(input) ? input : [input.lng, input.lat];
//       const feature: Feature<Point> = point(coords, {});
//       this.state.setOrigin(feature);
//     }
//   }

//   /**
//    * Геокодинг destination по placeId или установка прямо по координатам
//    */
//   public setDestination(input: string | google.maps.LatLngLiteral | [number, number]): void {
//     if (typeof input === 'string') {
//       this.loadingSubject.next(true);
//       this.geocoder.geocode({ placeId: input }).subscribe({
//         next: (resp: MapGeocoderResponse) => {
//           this.loadingSubject.next(false);
//           const { results, status } = resp;
//           if (status === 'OK' && results.length) {
//             const r = results[0];
//             const feature: Feature<Point> = point(
//               [r.geometry.location.lng(), r.geometry.location.lat()],
//                { placeId: r.place_id, name: r.formatted_address,description:r.formatted_address }
//             );
//             this.state.setDestination(feature);
//           } else {
//             this.state.setError(`Geocode destination failed: ${status}`);
//           }
//         },
//         error: err => {
//           this.loadingSubject.next(false);
//           this.state.setError(`Geocode destination error: ${err}`);
//         }
//       });
//     } else {
//       const coords = Array.isArray(input) ? input : [input.lng, input.lat];
//       const feature: Feature<Point> = point(coords, {});
//       this.state.setDestination(feature);
//     }
//   }


//  public addWaypoint(
//     indexOrInput: number | string | google.maps.LatLngLiteral | [number, number],
//     maybeInput?: string | google.maps.LatLngLiteral | [number, number]
//   ): void {
//     let index: number | undefined;
//     let input: string | google.maps.LatLngLiteral | [number, number];

//     if (typeof indexOrInput === 'number') {
//       index = indexOrInput;
//       input = maybeInput!;
//     } else {
//       input = indexOrInput;
//     }

//     const current = this.state.getState().waypoints || [];
//     const insertAt = (feat: Feature<Point>) => {
//       const updated = [...current];
//       if (index !== undefined && index >= 0 && index <= updated.length) {
//         updated.splice(index, 0, feat);
//       } else {
//         updated.push(feat);
//       }
//       this.state.setWaypoints(updated);
//     };

//     if (typeof input === 'string') {
//       this.loadingSubject.next(true);
//       this.geocoder.geocode({ placeId: input }).subscribe({
//         next: (resp: MapGeocoderResponse) => {
//           this.loadingSubject.next(false);
//           const { results, status } = resp;
//           if (status === 'OK' && results.length) {
//             const r = results[0];
//             const feature: Feature<Point> = point(
//               [r.geometry.location.lng(), r.geometry.location.lat()],
//               { placeId: r.place_id, name: r.formatted_address,description:r.formatted_address }
//             );
//             insertAt(feature);
//           } else {
//             this.state.setError(`Geocode waypoint failed: ${status}`);
//           }
//         },
//         error: err => {
//           this.loadingSubject.next(false);
//           this.state.setError(`Geocode waypoint error: ${err}`);
//         }
//       });
//     } else {
//       const coords = Array.isArray(input) ? input : [input.lng, input.lat];
//       const feature: Feature<Point> = point(coords, {});
//       insertAt(feature);
//     }
//   }

//   /**
//    * Remove a waypoint by index
//    */
//   public removeWaypoint(index: number): void {
//     const current = this.state.getState().waypoints || [];
//     if (index < 0 || index >= current.length) return;
//     const updated = current.filter((_, i) => i !== index);
//     console.log('removeWaypoint')
//     this.state.setWaypoints(updated);
//   }



//   /** Удалить origin */
//   public clearOrigin(): void {
//     this.state.clearOrigin();
//   }

//   /** Удалить destination */
//   public clearDestination(): void {
//     this.state.clearDestination();
//   }
// }

export class DirectionService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    // Эмитим сюда полный Google DirectionsResult
    private _directionsResult = new BehaviorSubject<google.maps.DirectionsResult | null>(null);
    public directionsResult$ = this._directionsResult.asObservable();

    private geocoder = inject(MapGeocoder);

    constructor(
        private state: DirectionStateService,
        private ngZone: NgZone
    ) { }

    /**
     * Вызывается компонентом, когда нужно получить новый маршрут
     */
    public fetchDirections(): void {
        const s = this.state.getState();
        if (!s.origin || !s.destination) {
            this.state.setError('Origin and destination must be set.');
            return;
        }

        // Преобразуем GeoJSON Feature<Point> в LatLngLiteral
        const [oLng, oLat] = s.origin.geometry.coordinates;
        const [dLng, dLat] = s.destination.geometry.coordinates;
        const originLatLng: google.maps.LatLngLiteral = { lat: oLat, lng: oLng };
        const destinationLatLng: google.maps.LatLngLiteral = { lat: dLat, lng: dLng };

        const request: google.maps.DirectionsRequest = {
            origin: originLatLng,
            destination: destinationLatLng,
            waypoints: s.waypoints?.map(feat => ({
                location: {
                    lat: feat.geometry.coordinates[1],
                    lng: feat.geometry.coordinates[0]
                },
                stopover: true
            })),
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: s.provideRouteAlternatives,
        };

        this.loadingSubject.next(true);

        google.maps.importLibrary('routes')
            .then((maps: any) => {
                const svc = new maps.DirectionsService();
                svc.route(request, (result, status) => {
                    this.ngZone.run(() => {
                        this.loadingSubject.next(false);
                        if (status === google.maps.DirectionsStatus.OK && result) {
                            this.state.setRoutes(result.routes);
                            this._directionsResult.next(result);
                        } else {
                            this.state.setError(result?.status || status);
                        }
                    });
                });
            })
            .catch(err => {
                this.ngZone.run(() => {
                    this.loadingSubject.next(false);
                    this.state.setError(`Failed to load directions library: ${err}`);
                });
            });
    }

    /**
     * Устанавливает origin:
     * - по placeId (forward-geocode)
     * - по координатам (reverse-geocode)
     */
    public setOrigin(input: string | google.maps.LatLngLiteral | [number, number]): void {
        if (typeof input === 'string') {
            // Forward-geocode
            this.loadingSubject.next(true);
            this.geocoder.geocode({ placeId: input }).subscribe({
                next: (resp: MapGeocoderResponse) => {
                    this.loadingSubject.next(false);
                    const { results, status } = resp;
                    if (status === 'OK' && results.length) {
                        const r = results[0];
                        const feature: any = point(
                            [r.geometry.location.lng(), r.geometry.location.lat()],
                            { placeId: r.place_id, name: r.formatted_address, description: r.formatted_address }
                        );
                        this.state.setOrigin(feature);
                    } else {
                        this.state.setError(`Geocode origin failed: ${status}`);
                    }
                },
                error: err => {
                    this.loadingSubject.next(false);
                    this.state.setError(`Geocode origin error: ${err}`);
                }
            });
        } else {
            // Reverse-geocode
            const loc: google.maps.LatLngLiteral = Array.isArray(input)
                ? { lng: input[0], lat: input[1] }
                : input;
            this.loadingSubject.next(true);
            this.geocoder.geocode({ location: loc }).subscribe({
                next: (resp: MapGeocoderResponse) => {
                    this.loadingSubject.next(false);
                    const { results, status } = resp;
                    if (status === 'OK' && results.length) {
                        const r = results[0];
                        const feature: any = point(
                            [loc.lng, loc.lat],
                            { placeId: r.place_id, name: r.formatted_address, description: r.formatted_address }
                        );
                        this.state.setOrigin(feature);
                    } else {
                        this.state.setError(`Reverse geocode origin failed: ${status}`);
                    }
                },
                error: err => {
                    this.loadingSubject.next(false);
                    this.state.setError(`Reverse geocode origin error: ${err}`);
                }
            });
        }
    }

    /**
     * Устанавливает destination:
     * - по placeId (forward-geocode)
     * - по координатам (reverse-geocode)
     */
    public setDestination(input: string | google.maps.LatLngLiteral | [number, number]): void {
        if (typeof input === 'string') {
            this.loadingSubject.next(true);
            this.geocoder.geocode({ placeId: input }).subscribe({
                next: (resp: MapGeocoderResponse) => {
                    this.loadingSubject.next(false);
                    const { results, status } = resp;
                    if (status === 'OK' && results.length) {
                        const r = results[0];
                        const feature: any = point(
                            [r.geometry.location.lng(), r.geometry.location.lat()],
                            { placeId: r.place_id, name: r.formatted_address, description: r.formatted_address }
                        );
                        this.state.setDestination(feature);
                    } else {
                        this.state.setError(`Geocode destination failed: ${status}`);
                    }
                },
                error: err => {
                    this.loadingSubject.next(false);
                    this.state.setError(`Geocode destination error: ${err}`);
                }
            });
        } else {
            const loc: google.maps.LatLngLiteral = Array.isArray(input)
                ? { lng: input[0], lat: input[1] }
                : input;
            this.loadingSubject.next(true);
            this.geocoder.geocode({ location: loc }).subscribe({
                next: (resp: MapGeocoderResponse) => {
                    this.loadingSubject.next(false);
                    const { results, status } = resp;
                    if (status === 'OK' && results.length) {
                        const r = results[0];
                        const feature: any = point(
                            [loc.lng, loc.lat],
                            { placeId: r.place_id, name: r.formatted_address, description: r.formatted_address }
                        );
                        this.state.setDestination(feature);
                    } else {
                        this.state.setError(`Reverse geocode destination failed: ${status}`);
                    }
                },
                error: err => {
                    this.loadingSubject.next(false);
                    this.state.setError(`Reverse geocode destination error: ${err}`);
                }
            });
        }
    }



    /**
     * Добавляет или вставляет waypoint по индексу
     */
    /**
    * Добавляет или вставляет waypoint по индексу и проставляет fieldIndex в свойствах
    */
    public addWaypoint(
        indexOrInput: number | string | google.maps.LatLngLiteral | [number, number],
        maybeInput?: string | google.maps.LatLngLiteral | [number, number]
    ): void {
        let index: number | undefined;
        let input: string | google.maps.LatLngLiteral | [number, number];

        if (typeof indexOrInput === 'number') {
            index = indexOrInput;
            input = maybeInput!;
        } else {
            input = indexOrInput;
        }

        const current = this.state.getState().waypoints || [];

        const insertAt = (feat: Feature<Point>) => {
            // Вставляем или добавляем новую фичу
            const updated = [...current];
            if (index !== undefined && index >= 0 && index <= updated.length) {
                updated.splice(index, 0, feat);
            } else {
                updated.push(feat);
            }
            // Обновляем fieldIndex в свойствах для всех точек
            const normalized = updated.map((w, i) => ({
                ...w,
                properties: {
                    ...w.properties,
                    fieldIndex: i
                }
            }));
            this.state.setWaypoints(normalized);
        };

        if (typeof input === 'string') {
            // Geocode по placeId
            this.loadingSubject.next(true);
            this.geocoder.geocode({ placeId: input }).subscribe({
                next: (resp: MapGeocoderResponse) => {
                    this.loadingSubject.next(false);
                    const { results, status } = resp;
                    if (status === 'OK' && results.length) {
                        const r = results[0];
                        const feat: any = point(
                            [r.geometry.location.lng(), r.geometry.location.lat()],
                            {
                                placeId: r.place_id,
                                name: r.formatted_address,
                                description: r.formatted_address
                            }
                        );
                        insertAt(feat);
                    } else {
                        this.state.setError(`Geocode waypoint failed: ${status}`);
                    }
                },
                error: err => {
                    this.loadingSubject.next(false);
                    this.state.setError(`Geocode waypoint error: ${err}`);
                }
            });
        } else {
            // Прямые координаты
            const coords = Array.isArray(input) ? input : [input.lng, input.lat];
            const feat: any = point(coords, {});
            insertAt(feat);
        }
    }


    public updateWaypoint(
        index: number,
        input: google.maps.LatLngLiteral | [number, number]
    ): void {
        const loc: google.maps.LatLngLiteral = Array.isArray(input)
            ? { lng: input[0], lat: input[1] }
            : input;

        this.loadingSubject.next(true);
        this.geocoder.geocode({ location: loc }).subscribe({
            next: (resp: MapGeocoderResponse) => {
                this.loadingSubject.next(false);
                const { results, status } = resp;
                if (status === 'OK' && results.length) {
                    const r = results[0];
                    // новый Feature для перетаскиваемой точки
                    const newFeat:any = point(
                        [loc.lng, loc.lat],
                        {
                            placeId: r.place_id,
                            name: r.formatted_address,
                            description: r.formatted_address
                        }
                    );

                    // забираем старый массив
                    const current = this.state.getState().waypoints || [];
                    if (index < 0 || index >= current.length) return;

                    // формируем новый массив, переписывая нужный индекс
                    const updated = current.map((oldFeat, i) => {
                        const base = i === index ? newFeat : oldFeat;
                        return {
                            ...base,
                            properties: {
                                ...base.properties,
                                fieldIndex: i
                            }
                        };
                    });

                    this.state.setWaypoints(updated);
                } else {
                    this.state.setError(`Reverse geocode waypoint failed: ${status}`);
                }
            },
            error: err => {
                this.loadingSubject.next(false);
                this.state.setError(`Reverse geocode waypoint error: ${err}`);
            }
        });
    }

    /**
     * Удаляет waypoint по индексу
     */
    public removeWaypoint(index: number): void {
        const current = this.state.getState().waypoints || [];
        if (index < 0 || index >= current.length) return;
        const updated = current.filter((_, i) => i !== index);
        this.state.setWaypoints(updated);
    }

    /** Удалить origin */
    public clearOrigin(): void {
        this.state.clearOrigin();
    }

    public clearWaypoints(): void {
        this.state.setWaypoints([]);
    }


    /** Удалить destination */
    public clearDestination(): void {
        this.state.clearDestination();
    }
}