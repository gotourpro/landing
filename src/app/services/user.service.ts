import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClientService } from './http-client.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private _http: HttpClientService,
    ) {
    }

    public getUser(): Observable<any> {
        return this._http
            .get<any>(`${environment.apiUri}auth/profile`);
    }

    public isAdmin(): Observable<boolean> {
        return of(true);
    }
}



