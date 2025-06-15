import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../../services/alerts/alert.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const alertService = inject<AlertService>(AlertService);
  const router = inject(Router);

  // Only access localStorage in the browser
  const token = isPlatformBrowser(platformId)
    ? localStorage.getItem('token')
    : null;

  const clonedReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('token');
        }
        alertService.errorToaster('Unauthorized: You have been logged out.');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
