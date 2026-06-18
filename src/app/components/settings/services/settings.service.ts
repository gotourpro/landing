import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { identity, Observable, Subject } from 'rxjs';
import { catchError, map, repeat, retry, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable()
export class SettingsService {

    public paginateAll$: Subject<any> = new Subject<any>();

    constructor(
        private _http: HttpClient,

    ) { }

    public create(data: any): Observable<any> {
        return this._http.post<any>(`${environment.apiUri}admin/global-settings`, data);
    }

    public findAll(): Observable<any> {
        return this._http.get<any>(`${environment.apiUri}admin/global-settings`);
    }

    public paginateAll(data: any, isRepeat = false): Observable<any> {
        return this._http.get<any>(`${environment.apiUri}admin/global-settings/paginate`, data)
            .pipe(
                map(response => response),
                catchError(error => error),
                retry({
                    delay: 10000
                }),
                isRepeat ? repeat({ delay: 10000 }) : identity,
                tap((data) => this.paginateAll$.next(data)),
            );
    }

    public search(query: string): Observable<any> {
        return this._http.get<any>(`${environment.apiUri}admin/global-settings/search?query=${query}`);
    }

    public edit(data: any): Observable<any> {
        const { id } = data || {};
        return this._http.put<any>(`${environment.apiUri}admin/global-settings/${id}`, data);
    }

    public delete(id: string): Observable<any> {
        return this._http.delete<any>(`${environment.apiUri}admin/global-settings/${id}`);
    }

    public getById(id: string): Observable<any> {
        return this._http.get<any>(`${environment.apiUri}admin/global-settings/${id}`);
    }

}

