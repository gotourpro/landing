import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation, withInMemoryScrolling, } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt";
import { JWT_NAME } from './constants/jwt-name.constant';
import localeEnGb from '@angular/common/locales/en-GB';
import { registerLocaleData } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { providePrimeNG } from 'primeng/config';
import { Noir } from './app-theme';
import { provideNgIdle } from '@ng-idle/core';
import { ErrorInterceptor } from './interceptors/http-error.interceptor';
import { RefreshInterceptor } from './interceptors/refresh.interceptor';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalizationService } from './services/localization.service';
import { environment } from '../environments/environment';


export function tokenGetter() {
  return sessionStorage.getItem(JWT_NAME);
}

registerLocaleData(localeEnGb);

export const appConfig: ApplicationConfig = {
  providers: [

    { provide: LOCALE_ID, useValue: 'en-GB' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    importProvidersFrom(
      GoogleTagManagerModule.forRoot({
        id: environment.gtmId
      })
    ),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    TranslateService,
    TranslateStore,
    LocalizationService,
    { provide: HTTP_INTERCEPTORS, useClass: RefreshInterceptor, multi: true },
    provideNgIdle(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withComponentInputBinding(), withEnabledBlockingInitialNavigation(), withInMemoryScrolling({
      scrollPositionRestoration: 'top', // This is the key option
      anchorScrolling: 'enabled'
    })),
    provideClientHydration(),
    provideAnimationsAsync(),
    // providePrimeNG({ theme: Noir, ripple: false, inputStyle: 'outlined' }),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Noir,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          },
          darkModeSelector: '.dark'
        }
      }
    }),
    provideHttpClient(),
    importProvidersFrom(MessageService, ToastModule),
    importProvidersFrom([
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:3000'],
          disallowedRoutes: ['localhost:3000/auth/login']
        }
      })
    ]),
    // provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
