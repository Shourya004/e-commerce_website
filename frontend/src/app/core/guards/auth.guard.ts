import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  // Not signed in: go to login and remember where they wanted to go
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
