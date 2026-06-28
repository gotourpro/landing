import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { LOCALES } from '../constants/locales.constants';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { GoogleMapsConfigService } from './google-maps-config.service';
import { ILocalizedText } from '../interfaces/localized-text.interface';
import { Observable } from 'rxjs';

export interface LanguageOption {
    name: string;
    code: string;
}

@Injectable({ providedIn: 'root' })
export class LocalizationService {
    private translate = inject(TranslateService);
    private primeng = inject(PrimeNG);
    private document = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);

    public languages: LanguageOption[] = [
        { name: 'English', code: 'en' },
        { name: 'العربية', code: 'ar' },
        { name: '中文 (简体)', code: 'zh-Hans' },
        { name: '中文 (繁體)', code: 'zh-Hant' },
        { name: 'Français', code: 'fr' },
        { name: 'Deutsch', code: 'de' },
        { name: 'Italiano', code: 'it' },
        { name: '日本語', code: 'ja' },
        { name: '한국어', code: 'ko' },
        { name: 'Português', code: 'pt' },
        { name: 'Русский', code: 'ru' },
        { name: 'Español', code: 'es' },
        { name: 'Tiếng Việt', code: 'vi' },
        { name: 'Türkçe', code: 'tr' }
    ];

    constructor(
        private mapsConfig: GoogleMapsConfigService,
    ) {

        this.translate.addLangs(this.languages.map(l => l.code));
        const saved = localStorage.getItem('app_language') || 'ru';
        this.setLanguage(saved);
        this.translate.onLangChange.subscribe(({ lang }) => {
            this.applyPrimeLocale(lang);
        });
    }

    public setLanguage(code: string) {
        if (!LOCALES[code]) code = 'en';
        this.translate.setDefaultLang(code);
        this.translate.use(code).subscribe(() => {
            localStorage.setItem('app_language', code);
            this.applyPrimeLocale(code);
            this.setHtmlLang(code);
            const region = this.mapRegionFromLanguage(code);
            this.mapsConfig.update({ loader: { language: code, region } });

        });
    }

    private applyPrimeLocale(code: string) {
        const cfg = LOCALES[code] || LOCALES['en'];
        this.primeng.setTranslation({ ...cfg, dateFormat: 'dd-mm-yy' });

    }

    private mapRegionFromLanguage(lang: string): string {
        switch (lang) {
            case 'ru': return 'RU';
            case 'tr': return 'TR';
            case 'en': return 'US';
            case 'fr': return 'FR';
            case 'de': return 'DE';
            case 'es': return 'ES';
            case 'it': return 'IT';
            case 'pt': return 'PT';
            case 'zh-Hans': return 'CN';
            case 'zh-Hant': return 'HK';
            case 'ja': return 'JP';
            case 'ko': return 'KR';
            case 'vi': return 'VN';
            case 'ar': return 'SA';
            default: return 'US';
        }
    }

    public getText(
        value?: ILocalizedText
    ): string {

        if (!value) {
            return '';
        }

        const lang =
            this.translate.currentLang as keyof ILocalizedText;

        return (
            value[lang] ??
            value.en ??
            value.ru
        );
    }

    private setHtmlLang(code: string) {
        if (isPlatformBrowser(this.platformId)) {
            this.document.documentElement.lang = code;
        }
    }

    public get languageChanged$(): Observable<LangChangeEvent> {
        return this.translate.onLangChange;
    }

    public getCurrentLanguage(): string {
        return this.translate.currentLang || 'en';
    }
}
