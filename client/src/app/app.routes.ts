import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./pages/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/auth/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent
          ),
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/features/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./pages/features/chat/chat.component').then(
            (m) => m.ChatComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
