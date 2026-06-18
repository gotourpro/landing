import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, filter, shareReplay } from 'rxjs';
import { GoogleMapsConfigService } from './google-maps-config.service';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private apiLoadedSubject = new BehaviorSubject<typeof google | null>(null);
  public readonly apiLoaded$: Observable<typeof google> = this.apiLoadedSubject.asObservable().pipe(
    filter((g): g is typeof google => !!g),
    shareReplay(1)
  );

  private loading = false;

  constructor(
    private configService: GoogleMapsConfigService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  public async reloadWithNewLanguage(lang: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.configService.update({ loader: { language: lang } });
    await this.loadGoogleMapsScript();
  }

  public async loadGoogleMapsScript(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.loading) return;
    this.loading = true;

    await this.removeOldScript();

    return new Promise<void>((resolve, reject) => {
      const config = this.configService.load();

      const queryParams = new URLSearchParams({
        key: config.loader.apiKey!,
        libraries: (config.loader.libraries ?? []).join(','),
        language: config.loader.language ?? 'en',
        region: config.loader.region ?? '',
        loading: 'async',
        v: config.loader.version ?? 'weekly',
        callback: 'initMap'
      });

      (window as any).initMap = () => {
        this.apiLoadedSubject.next(google);
        delete (window as any).initMap;
        this.loading = false;
        resolve();
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?${queryParams.toString()}`;
      script.async = true;
      script.defer = true;
      script.onerror = (e) => {
        console.error('[GoogleMapsLoader] Failed to load:', e);
        this.loading = false;
        reject(e);
      };

      document.head.appendChild(script);
    });
  }

  private async removeOldScript(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const scripts = Array.from(document.getElementsByTagName('script'));
    scripts
      .filter(s => s.src.includes('maps.googleapis.com'))
      .forEach(s => s.remove());

    delete (window as any).google;
    delete (window as any).initMap;

    Object.keys(window)
      .filter(k => k.startsWith('__googleMaps') || k.includes('google'))
      .forEach(k => delete (window as any)[k]);

    return Promise.resolve();
  }
}
