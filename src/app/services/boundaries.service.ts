
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class BoundariesService {
  private readonly apiUrl: string = `${environment.apiUri}boundaries`;

  constructor(private http: HttpClientService) {}

  public getBoundaryDetails(placeId: string, language?: string): Observable<any> {
    let params = new HttpParams();
    if (language) {
      params = params.set('language', language);
    }
    return this.http.get<any>(`${this.apiUrl}/details/${placeId}`, { params });
  }

  public autocomplete(
    input: string,
    language?: string,
    country?: string,
    types?: string,
    limit?: number
  ): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        input,
        ...(language && { language }),
        ...(country && { country }),
        ...(types && { types }),
        ...(limit && { limit: limit.toString() })
      }
    });
    return this.http.get<any>(`${this.apiUrl}/autocomplete`, { params });
  }
  
}

