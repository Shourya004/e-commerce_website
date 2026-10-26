import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Attach the token if we have one
//HTTP request objects are immutable (they cannot be directly changed), the interceptor clones the original request:
const withToken = (req: HttpRequest<unknown>, token: string | null) =>
  token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;
  const isAuthCall = req.url.includes('/auth/');

  return next(withToken(req, auth.token)).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only refresh for normal API calls that failed with 401 while we had a token
      if (error.status !== 401 || isAuthCall || !token) {
        return throwError(() => error);
      }
      return auth.refreshOnce().pipe(
        // If the refresh fails, the session is over
        catchError((refreshError) => {
          auth.forceLogout();
          return throwError(() => refreshError);
        }),
        switchMap((res) => next(withToken(req, res.access_token))),
      );
    }),
  );
};
