import { HttpContextToken, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, exhaustMap, switchMap, tap } from "rxjs/operators";
import { AuthService } from '../services/auth.service';
import { JWT_NAME } from '../constants/jwt-name.constant';


export const IS_PUBLIC = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError(err => {
      if (err?.status === 401) {
        inject(AuthService).logout();
      }
      return throwError(() => err);
    })
  );

// export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
//   const authSvc = inject(AuthService);

//   // Пропускаем публичные запросы
//   if (req.context.get(IS_PUBLIC)) {
//     return next(req);
//   }

//   const token = sessionStorage.getItem(JWT_NAME);

//   // Если пользователь авторизован (например, токен не истёк)
//   if (authSvc.isAuthenticated() && token) {
//     return next(addAuthorizationHeader(req, token));
//   }

//   // Иначе пробуем обновить токен
//   return authSvc.refreshToken().pipe(
//     tap(data => sessionStorage.setItem(JWT_NAME, data.token)),
//     switchMap(data => next(addAuthorizationHeader(req, data.token))),
//     catchError(error => {
//       console.error('Error token update:', error);
//       authSvc.logout(); // обычный метод — без RxJS
//       return throwError(() => error);
//     })
//   );
// };

// // Добавление токена в заголовки
// function addAuthorizationHeader(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
//   if (!token) return req;
//   return req.clone({
//     headers: req.headers.set('Authorization', `Bearer ${token}`)
//   });
// }