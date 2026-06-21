import {
    Inject,
    Injectable,
    PLATFORM_ID
} from '@angular/core';

import {
    isPlatformBrowser
} from '@angular/common';

import {
    NavigationEnd,
    Router
} from '@angular/router';

import {
    filter
} from 'rxjs/operators';

import {
    GoogleTagManagerService
} from 'angular-google-tag-manager';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {

    constructor(
        private readonly router: Router,
        private readonly gtmService: GoogleTagManagerService,
        @Inject(PLATFORM_ID)
        private readonly platformId: object
    ) { }

    public init(): void {

        if (
            !isPlatformBrowser(
                this.platformId
            )
        ) {
            return;
        }

        this.router.events
            .pipe(
                filter(
                    event =>
                        event instanceof NavigationEnd
                )
            )
            .subscribe(
                (event: NavigationEnd) => {

                    this.trackPageView(
                        event.urlAfterRedirects
                    );
                }
            );
    }

    public trackPageView(
        page: string
    ): void {

        this.push({
            event: 'page_view',
            page
        });
    }

    public trackEvent(
        event: string,
        data?: Record<string, any>
    ): void {

        this.push({
            event,
            ...data
        });
    }

    private push(
        tag: Record<string, any>
    ): void {

        if (
            !isPlatformBrowser(
                this.platformId
            )
        ) {
            return;
        }

        this.gtmService.pushTag(tag);
    }
}