import { BehaviorSubject, map, Observable, shareReplay, tap } from "rxjs";
import { IBlogPost } from "../interfaces/blog-post.interface";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IBlogPage } from "../interfaces/blog-page.interface";

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    private readonly dataUrl =
        'assets/data/blog/blog.json';

    private readonly _posts =
        new BehaviorSubject<IBlogPost[]>([]);

    public readonly posts$ =
        this._posts.asObservable();

    constructor(
        private readonly http: HttpClient
    ) {}

    public load(): Observable<IBlogPost[]> {

        return this.http
            .get<IBlogPost[]>(this.dataUrl)
            .pipe(
                tap(items =>
                    this._posts.next(items)
                ),
                shareReplay(1)
            );
    }

    public getList(): Observable<IBlogPost[]> {

        return this.http.get<IBlogPost[]>(
            this.dataUrl
        );
    }

    public getBySlug(
        slug: string
    ): Observable<IBlogPost | undefined> {

        return this.getList().pipe(
            map(items =>
                items.find(
                    item =>
                        item.slug === slug
                )
            )
        );
    }

    public getFeatured(): Observable<IBlogPost[]> {

        return this.getList().pipe(
            map(items =>
                items.filter(
                    item => item.featured
                )
            )
        );
    }

    public getPopular(): Observable<IBlogPost[]> {

        return this.getList().pipe(
            map(items =>
                items.filter(
                    item => item.popular
                )
            )
        );
    }

    public getByCategory(
        category: string
    ): Observable<IBlogPost[]> {

        return this.getList().pipe(
            map(items =>
                items.filter(
                    item =>
                        item.category === category
                )
            )
        );
    }

    public getPage(
        page: number,
        limit: number
    ): Observable<IBlogPage> {

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