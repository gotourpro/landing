import { Injectable } from '@angular/core';
import { IGoogleMapsConfig } from '../interfaces/google.maps.config.interface';
import { GOOGLE_DEFAULT_CONFIG } from '../constants/google.maps.config.constant';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'google-maps-config';

@Injectable({ providedIn: 'root' })
export class GoogleMapsConfigService {

    public readonly styleChanged$ = new BehaviorSubject<google.maps.Data.StyleOptions>(
        this.load().style
    );

    public load(): IGoogleMapsConfig {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw) {
            try {
                const parsed = JSON.parse(raw) as Partial<IGoogleMapsConfig>;
                const merged: IGoogleMapsConfig = {
                    loader: { ...GOOGLE_DEFAULT_CONFIG.loader, ...parsed.loader },
                    style: { ...GOOGLE_DEFAULT_CONFIG.style, ...parsed.style }
                };

                if (!merged.loader.apiKey) {
                    console.warn('Google Maps API key is missing. Please provide it in configuration.');
                }

                return merged;
            } catch (e) {
                console.warn('Failed to parse Google Maps config from localStorage:', e);
            }
        }

        this.save(GOOGLE_DEFAULT_CONFIG);
        return GOOGLE_DEFAULT_CONFIG;
    }

    public save(config: IGoogleMapsConfig): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    public update(partial: Partial<Omit<IGoogleMapsConfig, 'loader'>> & {
        loader?: Partial<Omit<IGoogleMapsConfig['loader'], 'apiKey'>>
    }): IGoogleMapsConfig {
        const current = this.load();

        const updated: IGoogleMapsConfig = {
            loader: { ...current.loader, ...partial.loader },
            style: { ...current.style, ...partial.style }
        };

        this.save(updated);
        this.styleChanged$.next(updated.style);
        return updated;
    }

    public clear(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    public getStyle(): IGoogleMapsConfig['style'] {
        return this.load().style;
    }

    public getLoader(): IGoogleMapsConfig['loader'] {
        return this.load().loader;
    }
}
