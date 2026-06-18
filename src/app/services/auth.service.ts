
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { defer, Observable, of, Subscription, throwError, timer } from 'rxjs';
import { tap, switchMap, map, catchError, shareReplay } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClientService } from './http-client.service';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { uuid } from '@primeuix/utils';


@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private refreshSub?: Subscription;
  private readonly TOKEN_LIFETIME_MS = 10 * 60 * 1000; // 10 минут
  private readonly REFRESH_THRESHOLD_MS = 540 * 1000;  // 9 минут
  private tabId = uuid();
  private bc = new BroadcastChannel('auth');
  public isLoggedIn = false;
  
  private isAuth$: Observable<boolean> = defer(() =>
    this.httpClient.get<{ isAuth: boolean }>(`${environment.apiUri}auth/is-auth`)
  ).pipe(
    map(r => r.isAuth),
    catchError(() => of(false)),
    shareReplay(1)
  );

  constructor(
    private httpClient: HttpClientService,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.bc.onmessage = (ev) => {
      if (ev.data?.type === 'logout' && ev.data.tabId !== this.tabId) {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    };
  }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuth$;
  }

  public login(form: LoginForm): Observable<boolean> {
    return this.httpClient.post<{ token: string }>(`${environment.apiUri}auth/login`, form).pipe(
      tap(({ token }) => {
        this.isLoggedIn = true;
        const exp = this.jwtHelper.getTokenExpirationDate(token)?.getTime();
        if (exp) {
          this.scheduleTokenRefresh(exp);
        }
        this.resetAuthCheck();
      }),
      map(() => true),
      catchError((error) => {
        this.cleanup();
        return throwError(() => error);
      })
    );
  }

  private scheduleTokenRefresh(expMs: number): void {
    this.cleanupTimer(); // Только очищаем таймер
    
    const now = Date.now();
    const timeUntilRefresh = expMs - now - this.REFRESH_THRESHOLD_MS;
    const refreshInterval = this.TOKEN_LIFETIME_MS - this.REFRESH_THRESHOLD_MS;

    console.log(`[Auth] Токен истекает через: ${Math.round((expMs - now)/1000)} сек`);
    console.log(`[Auth] Обновление через: ${Math.round(timeUntilRefresh/1000)} сек`);

    if (timeUntilRefresh <= 0) {
      this.refreshTokens().subscribe();
    } else {
      this.refreshSub = timer(timeUntilRefresh, refreshInterval)
        .pipe(
          tap(() => console.log('[Auth] Автоматическое обновление токена')),
          switchMap(() => this.refreshTokens())
        )
        .subscribe();
    }
  }
    

  public refreshTokens(): Observable<void> {
    if (!this.isLoggedIn) {
      console.warn('[Auth] Пропуск обновления: пользователь не авторизован');
      return of(undefined);
    }

    console.log('[Auth] Запрос на обновление токена');
    return this.httpClient.post<{ token: string }>(`${environment.apiUri}auth/refresh-token`, {})
      .pipe(
        tap(({ token }) => {
          console.log('[Auth] Токен успешно обновлен');
          const exp = this.jwtHelper.getTokenExpirationDate(token)?.getTime();
          if (exp) {
            this.scheduleTokenRefresh(exp);
          }
        }),
        map(() => void 0),
        catchError(err => {
          console.error('[Auth] Ошибка обновления токена:', err);
          this.logout();
          return throwError(() => err);
        })
      );
  }

  public logout(): void {
    this.httpClient.post(`${environment.apiUri}auth/logout`, {}).subscribe({
      next: () => this.afterLogout(),
      error: () => this.afterLogout(),
    });
  }

  private afterLogout(): void {
    this.cleanup();
    this.bc.postMessage({ type: 'logout', tabId: this.tabId });
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private cleanupTimer(): void {
    if (this.refreshSub) {
      console.log('[Auth] Очистка таймера обновления');
      this.refreshSub.unsubscribe();
      this.refreshSub = undefined;
    }
  }

  private cleanup(): void {
    this.isLoggedIn = false;
    this.cleanupTimer();
  }

  private resetAuthCheck(): void {
    this.isAuth$ = defer(() =>
      this.httpClient.get<{ isAuth: boolean }>(`${environment.apiUri}auth/is-auth`)
    ).pipe(
      map(r => r.isAuth),
      catchError(() => of(false)),
      shareReplay(1)
    );
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}