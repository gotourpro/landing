import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JWT_NAME, REFRESHTOKEN_KEY } from '../constants/jwt-name.constant';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
    ) {
    }

    public setToken(token: string): void {
       sessionStorage.setItem(JWT_NAME, token);
    }

    public setRefreshToken(token: string): void {
        sessionStorage.setItem(REFRESHTOKEN_KEY, token);
    }

    public removeToken(): void {
       sessionStorage.removeItem(JWT_NAME);
       sessionStorage.removeItem(REFRESHTOKEN_KEY);
    }

    public getToken(): string | null {
        return sessionStorage.getItem(JWT_NAME) || '';
    }

    public getRefreshToken(): string | null {
        return sessionStorage.getItem(REFRESHTOKEN_KEY) || '';
      }

    public isToken(): boolean {
        return !!this.getToken();
    }
}


