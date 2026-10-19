import { HttpInterceptor, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Full addresses (https://...) are left alone
  if (req.url.startsWith('http')) return next(req);

  return next(req.clone({ url: environment.apiBaseUrl + req.url }));
};
