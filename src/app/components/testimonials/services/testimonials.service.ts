import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ITestimonial } from "../interfaces/itestimonial.interface";

@Injectable({
    providedIn: 'root'
})
export class TestimonialsService {

    private readonly dataUrl =
        'assets/data/testimonials/testimonials.json';

    constructor(
        private readonly http: HttpClient
    ) {}

    public getList(): Observable<ITestimonial[]> {
        return this.http.get<ITestimonial[]>(this.dataUrl);
    }

    public getFeatured(): Observable<ITestimonial[]> {
        return this.getList().pipe(
            map(items => items.filter(item => item.featured))
        );
    }
}