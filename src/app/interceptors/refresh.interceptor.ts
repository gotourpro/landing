import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
  } from '@angular/common/http';
  import { Injectable, Injector } from '@angular/core';
  import { Observable, throwError, switchMap, catchError } from 'rxjs';
  import { AuthService } from '../services/auth.service';
  
  @Injectable()
export class RefreshInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        const auth = this.injector.get(AuthService);
        
        // Проверяем:
        // 1. Это 401 ошибка
        // 2. Это не запрос refresh-token
        // 3. Это не запрос login
        // 4. Пользователь залогинен (по флагу isLoggedIn)
        if (err instanceof HttpErrorResponse &&
            err.status === 401 &&
            !req.url.includes('/refresh-token') &&
            !req.url.includes('/login') &&
            auth.isLoggedIn) {
          
          return auth.refreshTokens().pipe(
            switchMap(() => next.handle(req)), // Повторяем оригинальный запрос
            catchError(e => {
              auth.logout();
              return throwError(() => e);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}