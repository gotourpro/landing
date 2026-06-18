import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FindPlaceService {
  private readonly apiUrl: string = `${environment.apiUri}find-places`;

  constructor(private http: HttpClient) { }

  public getPlaceDetails(placeId: string, language?: string): Observable<any> {
    let params = new HttpParams();
    if (language) {
      params = params.set('language', language);
    }
    return this.http.get<any>(`${this.apiUrl}/details/${placeId}`, { params });
  }

  public searchPlaces(query: string, language?: string): Observable<any> {
    let params = new HttpParams().set('query', query);
    if (language) {
      params = params.set('language', language);
    }
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  public autocomplete(
    input: string,
    types?: string,
    language?: string,
    citiesOnly?: boolean,
    country?: string
  ): Observable<any> {
    const params = {
      input,
      ...(types && { types }),
      ...(language && { language }),
      ...(citiesOnly !== undefined && { citiesOnly: String(citiesOnly) }),
      ...(country && { country })
    };
    return this.http.get<any>(`${this.apiUrl}/autocomplete`, { params });
  }

}
