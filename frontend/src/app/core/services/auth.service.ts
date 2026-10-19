import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { clearHttpCache } from '../interceptors/cache.interceptor';

@Injectable({ providedIn: 'root' })
export class AuthService {
  //This line checks if the app is currently executing in a web browser or on a server.
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private router = inject(Router);

  //getter
  get token(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  saveToken(token: string) {
    if (this.isBrowser) localStorage.setItem('token', token);
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem('token');
    clearHttpCache();
    this.router.navigate(['/auth/login']);
  }
}
