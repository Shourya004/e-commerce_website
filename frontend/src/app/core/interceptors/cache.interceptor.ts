import { HttpContextToken, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { of, tap } from 'rxjs';

// Use this on a request that must never be cached
export const SKIP_CACHE = new HttpContextToken<boolean>(() => false);

const CACHE_TIME_MS = 5 * 60 * 1000; // 5 minutes

const cache = new Map<string, { response: HttpResponse<unknown>; expires: number }>();

export function clearHttpCache(): void {
  cache.clear();
}

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // No caching on the SSR server
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return next(req);

  // Changing data (POST/PUT/PATCH/DELETE) clears the cache so nothing is stale
  if (req.method !== 'GET') {
    cache.clear();
    return next(req);
  }

  if (req.context.get(SKIP_CACHE)) return next(req);

  const key = req.urlWithParams;
  const hit = cache.get(key);

  // Fresh copy in the cache: answer without calling the server
  if (hit && hit.expires > Date.now()) {
    return of(hit.response.clone());
  }

  // Otherwise call the server and remember the answer
  return next(req).pipe(
    tap((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        cache.set(key, { response: event, expires: Date.now() + CACHE_TIME_MS });
      }
    }),
  );
};
