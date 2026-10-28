import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  //state.Url Captures the exact URL path the user was trying to access before they were intercepted (e.g., /dashboard/settings?user=123).
  ///auth/login?returnUrl=%2Fdashboard%2Fsettings
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  if (auth.isAdmin()) return true;

  // Signed in, but not the shop owner
  return router.createUrlTree(['/']);
};
