import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
    BehaviorSubject,
    Observable
} from 'rxjs';

import {
    map,
    shareReplay,
    tap
} from 'rxjs/operators';
import { ITour } from '../interfaces/tour.interface';
import { ITourPage } from '../interfaces/tour-page.interface';


@Injectable({
    providedIn: 'root'
})
export class ToursService {

    private readonly dataUrl =
        'assets/data/tours/tours.json';

    private readonly _tours =
        new BehaviorSubject<ITour[]>([]);

    public readonly tours$ =
        this._tours.asObservable();

    constructor(
        private readonly http: HttpClient
    ) { }

    public load(): Observable<ITour[]> {
        return this.http
            .get<ITour[]>(this.dataUrl)
            .pipe(
                tap(items => this._tours.next(items)),
                shareReplay(1)
            );
    }

    public getList(): Observable<ITour[]> {
        return this.http.get<ITour[]>(this.dataUrl);
    }

    public getBySlug(
        slug: string
    ): Observable<ITour | undefined> {
        return this.getList().pipe(
            map(items =>
                items.find(item => item.slug === slug)
            )
        );
    }


    public getByCategory(
        categorySlug: string
    ): Observable<ITour[]> {

        return this.getList().pipe(
            map(items =>
                items.filter(item =>
                    item.categorySlugs?.includes(
                        categorySlug
                    )
                )
            )
        );
    }

    public getPageByCategory(
        categorySlug: string,
        page: number,
        limit: number
    ): Observable<ITourPage> {

        return this.getByCategory(categorySlug).pipe(
            map(items => {

                const start =
                    (page - 1) * limit;

                const data =
                    items.slice(
                        start,
                        start + limit
                    );

                return {
                    items: data,
                    total: items.length,
                    hasMore:
                        start + limit <
                        items.length
                };
            })
        );
    }

    public getFeatured(): Observable<ITour[]> {
        return this.getList().pipe(
            map(items =>
                items.filter(item => item.featured)
            )
        );
    }

    public getPopular(): Observable<ITour[]> {
        return this.getList().pipe(
            map(items =>
                items.filter(item => item.popular)
            )
        );
    }

    public getByDestination(
        destinationSlug: string
    ): Observable<ITour[]> {

        return this.getList().pipe(
            map(items =>
                items.filter(item =>
                    item.destinationSlugs?.includes(
                        destinationSlug
                    )
                )
            )
        );
    }


    public getByDestinations(
        destinationSlugs: string[]
    ): Observable<ITour[]> {

        return this.getList().pipe(
            map(items =>
                items.filter(item =>
                    item.destinationSlugs?.some(
                        slug =>
                            destinationSlugs.includes(slug)
                    )
                )
            )
        );
    }

    public getPage(
        page: number,
        limit: number
    ): Observable<ITourPage> {

        return this.getList().pipe(
            map(items => {

                const start =
                    (page - 1) * limit;

                const data =
                    items.slice(
                        start,
                        start + limit
                    );

                return {
                    items: data,
                    total: items.length,
                    hasMore:
                        start + limit <
                        items.length
                };
            })
        );
    }
}