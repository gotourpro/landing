import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
    BehaviorSubject,
    Observable,
    map,
    shareReplay,
    tap
} from 'rxjs';

import { IDestination } from '../interfaces/destination.interface';
import { IDestinationPage } from '../interfaces/destination-page.interface';

@Injectable({
    providedIn: 'root'
})
export class DestinationsService {

    private readonly dataUrl =
        'assets/data/destinations/destinations.json';

    private readonly _destinations =
        new BehaviorSubject<IDestination[]>([]);

    public readonly destinations$ =
        this._destinations.asObservable();

    constructor(
        private readonly http: HttpClient
    ) { }

    public load(): Observable<IDestination[]> {
        return this.http
            .get<IDestination[]>(this.dataUrl)
            .pipe(
                tap(items => this._destinations.next(items)),
                shareReplay(1)
            );
    }

    public getList(): Observable<IDestination[]> {
        return this.http.get<IDestination[]>(this.dataUrl);
    }

    public getBySlug(slug: string): Observable<IDestination | undefined> {
        return this.getList()
            .pipe(
                map(items =>
                    items.find(item => item.slug === slug)
                )
            );
    }

    public getFeatured(): Observable<IDestination[]> {
        return this.getList()
            .pipe(
                map(items =>
                    items.filter(item => item.featured)
                )
            );
    }

    public getPopular(): Observable<IDestination[]> {
        return this.getList().pipe(
            map(items =>
                items.filter(item => item.popular)
            )
        );
    }

    public getPage(
        page: number,
        limit: number
    ): Observable<IDestinationPage> {
        return this.getList().pipe(
            map(items => {
                const start = (page - 1) * limit;
                const data = items.slice(start, start + limit);

                return {
                    items: data,
                    total: items.length,
                    hasMore: start + limit < items.length
                };
            })
        );
    }
}

