import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Home } from './features/home/home';
import { Collections } from './features/collections/collections';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { Login } from './features/auth/login/login';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'collections', component: Collections },
      { path: '**', component: NotFound },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [{ path: 'login', component: Login }],
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [{ path: '', component: Dashboard }],
  },
  { path: '**', component: NotFound },
];
