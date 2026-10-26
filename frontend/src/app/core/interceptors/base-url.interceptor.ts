import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Full addresses (https://...) are left alone
  if (req.url.startsWith('http')) return next(req);

  // withCredentials lets the browser send and receive the refresh-token cookie
  return next(req.clone({ url: environment.apiBaseUrl + req.url, withCredentials: true }));
};
