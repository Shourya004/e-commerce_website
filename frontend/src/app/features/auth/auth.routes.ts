import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Sign in',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Create account',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'forgot-password',
    title: 'Forgot password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'reset-password',
    title: 'Reset password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password').then((m) => m.ResetPassword),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
