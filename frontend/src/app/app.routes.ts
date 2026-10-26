import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Home } from './features/home/home';
import { Collections } from './features/collections/collections';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { NotFound } from './features/not-found/not-found';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'collections', component: Collections },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    children: [{ path: '', component: Dashboard }],
  },
  // 404 goes last, still inside the main layout so the navbar and footer show
  {
    path: '**',
    component: MainLayout,
    children: [{ path: '', component: NotFound }],
  },
];
