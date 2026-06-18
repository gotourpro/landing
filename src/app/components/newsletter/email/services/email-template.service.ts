import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// external operators
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class EmailTemplaterService {

    public templates$: Subject<any> = new Subject<any>();
    public template$: Subject<any> = new Subject<any>();

    constructor(
        private _http: HttpClient,

    ) { }

    public create(data: any): Observable<any> {
        return this._http.post<any>(`${environment.apiUri}v1/order`, data);
    }

    public findAll(data: any): Observable<any> {
        return this._http.post<any>(`${environment.apiUri}v1/order`, data);
    }

    public paginateAll(data: any): Observable<any> {
        return this._http.get<any>(`${environment.apiUri}templates/email/paginate`, data)
        .pipe(
            tap((data) => this.templates$.next(data)),
          );
    }

    public edit(data: any): Observable<any> {
        return this._http.put<any>(`${environment.apiUri}v1/order`, data);
    }

    public getById(orderId: string): Observable<any> {
        return this._http.get<any>(`${environment.apiUri}v1/order?id=${orderId}`);
    }

    public search(query: string): Observable<any> {
        return this._http.get<any>(`${environment.apiUri}v1/orders?search=${query}`)
            .pipe(
                tap((data) => this.template$.next(data)),
            );
    }

}

