import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../../services/alerts/alert.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const alertService = inject<AlertService>(AlertService);
  const router = inject(Router);

  const clonedReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        alertService.errorToaster('Unauthorized: You have been logged out.');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
