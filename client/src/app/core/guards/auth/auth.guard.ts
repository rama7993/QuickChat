import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SafeStorageService } from '../../services/storage/safe-storage.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storage = inject(SafeStorageService);

  const token = storage.get('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
