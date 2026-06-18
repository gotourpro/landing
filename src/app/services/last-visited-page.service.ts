import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LastVisitedPageService {
    private storageKey: string = 'lastVisitedUrl';

    public setLastVisitedUrl(url: string): void {
        if(url === '/login' || url==='/notfound') return;
        sessionStorage.setItem(this.storageKey, url);
    }

    public getLastVisitedUrl(): string {
        return sessionStorage.getItem(this.storageKey) || '/';
    }

    public clearLastVisitedUrl(): void {
        sessionStorage.removeItem(this.storageKey);
    }
}