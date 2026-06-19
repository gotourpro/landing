import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, startWith, switchMap } from 'rxjs';
import { LegalDocumentType } from '../types/legal-document.type';
import { ILegalDocument } from '../interfaces/legal-document.interface';
import { LocalizationService } from './localization.service';

@Injectable({
    providedIn: 'root'
})
export class LegalContentService {

    private readonly basePath =
        'assets/data/legal';

    constructor(
        private readonly http: HttpClient,
        private readonly localization: LocalizationService
    ) {}

    public getDocument(
        type: LegalDocumentType
    ): Observable<ILegalDocument> {

        return this.localization.languageChanged$.pipe(

            startWith({
                lang:
                    this.localization
                        .getCurrentLanguage()
            }),

            switchMap(({ lang }) =>
                this.http.get<ILegalDocument>(
                    `${this.basePath}/${type}/${lang}.json`
                )
            )
        );
    }
}