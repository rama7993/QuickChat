import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  userImage = 'https://i.pravatar.cc/150?img=32';
  showUserMenu = false;
  currentUser = this.authService.currentUser;

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  navTo(url: string): void {
    this.showUserMenu = false;
    this.router.navigate([url]);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.showUserMenu = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }
}
