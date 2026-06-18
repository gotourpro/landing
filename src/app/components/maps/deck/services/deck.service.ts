import { Injectable, NgZone, OnDestroy } from '@angular/core';
// external lib
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { Layer } from '@deck.gl/core';

export type DeckL = Layer<{}>;
type DeckProps = any;
@Injectable()
export class DeckService implements OnDestroy {

    private _deck: GoogleMapsOverlay | null = null;
    public layers: Map<Layer<any>, DeckL> = new Map<Layer<any>, DeckL>();
    public readonly _updateLayer$ = new BehaviorSubject<void>(undefined);

    constructor(private _zone: NgZone) { }

    /**
     * Возвращает инстанс GoogleMapsOverlay.
     * @throws Ошибка, если _deck не инициализирован.
     */
    public getDeck(): GoogleMapsOverlay {
        if (!this._deck) {
            throw new Error('DeckService: GoogleMapsOverlay не инициализирован. Сначала вызови createLayer().');
        }
        return this._deck;
    }

    /**
     * Возвращает все слои.
     */
    public getLayers(): DeckL[] {
        return [...this.layers.values()];
    }

    /**
     * Создаёт GoogleMapsOverlay и сохраняет его в _deck.
     */
    public createLayer(opts: DeckProps): Observable<void> {
        return new Observable((observer: Observer<void>) => {
            this._zone.runOutsideAngular(() => {
                this._deck = new GoogleMapsOverlay(opts);
            });
            observer.next();
            observer.complete();
        });
    }

    /**
     * Добавляет слой и отправляет уведомление об обновлении.
     */
    public addLayer(layer: any, el: DeckL): void {
        this.layers.set(layer, el);
        this._updateLayer$.next();
    }

    /**
     * Удаляет слой и (по желанию) отправляет обновление.
     */
    public removeLayer(layer: any, update: boolean = false): void {
        if (this.layers.has(layer)) {
            this.layers.delete(layer);
            if (update) {
                this._updateLayer$.next();
            }
        }
    }

    /**
     * Очищает ресурсы при уничтожении сервиса.
     */
    public ngOnDestroy(): void {
        this._updateLayer$.complete();
        this.layers.clear();
        if (this._deck) {
            this._deck.finalize();
            this._deck = null;
        }
    }
}