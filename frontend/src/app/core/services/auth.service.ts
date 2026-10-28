import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { clearHttpCache, SKIP_CACHE } from '../interceptors/cache.interceptor';
import { HttpClient, HttpContext } from '@angular/common/http';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from '../../features/auth/models/auth.models';
import {
  catchError,
  finalize,
  firstValueFrom,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private refreshRequest$: Observable<TokenResponse> | null = null;

  private accessToken = signal<string | null>(null);

  readonly user = signal<User | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly isAdmin = computed(() => this.user()?.role == 'admin');

  //getter
  get token(): string | null {
    return this.accessToken();
  }

  login(body: LoginRequest) {
    return this.http.post<TokenResponse>('/auth/login', body).pipe(
      tap((res) => this.accessToken.set(res.access_token)),
      switchMap(() => this.loadUser()),
    );
  }

  register(body: RegisterRequest) {
    return this.http.post<User>('/auth/register', body);
  }

  loadUser() {
    // Always ask the server for the current user (never use the cache)
    const context = new HttpContext().set(SKIP_CACHE, true);
    return this.http.get<User>('/users/me', { context }).pipe(tap((user) => this.user.set(user)));
  }

  // Asks the backend for a new access token using the refresh cookies
  refresh() {
    return this.http
      .post<TokenResponse>('/auth/refresh', {})
      .pipe(tap((res) => this.accessToken.set(res.access_token)));
  }

  // Many requests can fail at the same moment; they all share one refresh call
  refreshOnce(): Observable<TokenResponse> {
    if (!this.refreshRequest$) {
      this.refreshRequest$ = this.refresh().pipe(
        finalize(() => (this.refreshRequest$ = null)),
        shareReplay(1),
      );
    }
    return this.refreshRequest$;
  }

  // The session is over (refresh failed): clear everything and go to login
  forceLogout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  // Runs once when the app starts. Never fails: if there is no valid cookie we just stay logged out.
  restoreSession(): Promise<void> {
    return firstValueFrom(
      this.refresh().pipe(
        switchMap(() => this.loadUser()),
        map(() => undefined),
        catchError(() => of(undefined)),
      ),
    );
  }

  // User clicked "Log out"
  logout(): void {
    this.http
      .post('/auth/logout', {})
      .pipe(catchError(() => of(null)))
      .subscribe();
    this.clearSession();
    this.router.navigate(['auth/login']);
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.user.set(null);
    clearHttpCache();
  }
}

// 1. The Access Token (In Memory / Signal)

// The access_token returned by the server (res.access_token) is saved directly in your application's state using this.accessToken.set().
// • Where it lives: In the browser's volatile RAM memory.
// • What happens if you refresh the browser? It is completely wiped out, and your app will need to call this refresh() method again to get a new one.

// 2. The Refresh Token (In a Cookie)

// The Refresh Token is what lives in your browser's cookies.
// • How it gets sent: When your code calls this.http.post('/auth/refresh', {}), the browser automatically pulls the refresh cookie from its secure cookie storage and attaches it to the request header.
// • Security note: This is usually set as an HttpOnly cookie by the backend, meaning your frontend JavaScript code cannot read, modify, or steal it. It exists purely for the browser to pass back and forth to the server.
