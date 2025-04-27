import { Routes } from '@angular/router';

export const routes: Routes = [
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
          import('./pages/auth/password/password.component').then(
            (m) => m.PasswordComponent
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: 'chat',
        loadComponent: () =>
          import('./pages/chat/chat.component').then((m) => m.ChatComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
