import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ITourCategory } from "../interfaces/tour-category.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TourCategoryService {

    private readonly dataUrl =
        'assets/data/tours/categories.json';

    constructor(
        private readonly http: HttpClient
    ) { }

    public getList(): Observable<ITourCategory[]> {
        return this.http.get<ITourCategory[]>(
            this.dataUrl
        );
    }

    public getBySlug(
        slug: string
    ): Observable<ITourCategory | undefined> {
        return this.getList().pipe(
            map(items =>
                items.find(
                    item => item.slug === slug
                )
            )
        );
    }
}