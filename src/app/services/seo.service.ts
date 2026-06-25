import {
    Injectable,
    inject
} from '@angular/core';

import {
    Meta,
    Title
} from '@angular/platform-browser';
import { ISeoConfig } from '../interfaces/seo-config.interface';
import { TranslateService } from '@ngx-translate/core';
import { merge, of, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    private readonly title =
        inject(Title);

    private readonly meta =
        inject(Meta);

    public update(
        config: ISeoConfig
    ): void {

        this.title.setTitle(
            config.title
        );

        this.updateTag(
            'description',
            config.description
        );

        if (config.keywords) {

            this.updateTag(
                'keywords',
                config.keywords
            );
        }

        // Open Graph

        this.updateProperty(
            'og:title',
            config.title
        );

        this.updateProperty(
            'og:description',
            config.description
        );

        this.updateProperty(
            'og:type',
            config.type ?? 'website'
        );

        if (config.image) {

            this.updateProperty(
                'og:image',
                config.image
            );

        }

        if (config.url) {

            this.updateProperty(
                'og:url',
                config.url
            );

        }

        // Article

        if (config.author) {

            this.updateProperty(
                'article:author',
                config.author
            );

        }

        if (config.publishedTime) {

            this.updateProperty(
                'article:published_time',
                config.publishedTime
            );

        }

        if (config.modifiedTime) {

            this.updateProperty(
                'article:modified_time',
                config.modifiedTime
            );

        }
        // Twitter

        this.updateTag(
            'twitter:card',
            'summary_large_image'
        );

        this.updateTag(
            'twitter:title',
            config.title
        );

        this.updateTag(
            'twitter:description',
            config.description
        );

        if (config.image) {

            this.updateTag(
                'twitter:image',
                config.image
            );
        }

        // html lang

        if (config.lang) {

            document.documentElement.lang =
                config.lang;
        }
    }

    private updateTag(
        name: string,
        content: string
    ): void {

        this.meta.updateTag({
            name,
            content
        });
    }

    private updateProperty(property: string, content: string): void {
        this.meta.updateTag({ property, content });
    }

    public fromTranslation(
        translate: TranslateService,
        path: string
    ): Subscription {

        return merge(
            of(null),
            translate.onLangChange
        ).subscribe(() => {

            translate
                .get([
                    `${path}.title`,
                    `${path}.description`
                ])
                .subscribe(result => {

                    this.update({
                        title: result[
                            `${path}.title`
                        ],
                        description: result[
                            `${path}.description`
                        ],
                        lang:
                            translate.currentLang
                    });
                });
        });
    }
}