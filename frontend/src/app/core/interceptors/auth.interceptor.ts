import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;

  // Attach the token if we have one
  //HTTP request objects are immutable (they cannot be directly changed), the interceptor clones the original request:
  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 = not logged in or token expired. A wrong password on the login
      // request also returns 401, so we skip that one.
      if (error.status === 401 && !req.url.includes('/login')) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};
