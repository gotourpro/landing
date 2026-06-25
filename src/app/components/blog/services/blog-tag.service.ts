import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { IBlogCategory } from "../interfaces/blog-category.interface";

@Injectable({
    providedIn: 'root'
})
export class BlogTagService {

    private readonly dataUrl =
        'assets/data/blog/blog-tags.json';

    constructor(
        private readonly http: HttpClient
    ) { }

    public getList(): Observable<IBlogCategory[]> {
        return this.http.get<IBlogCategory[]>(
            this.dataUrl
        );
    }

    public getBySlug(
        slug: string
    ): Observable<IBlogCategory | undefined> {
        return this.getList().pipe(
            map(items =>
                items.find(
                    item => item.slug === slug
                )
            )
        );
    }
}