import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { HeaderComponent } from '../../pages/features/header/header.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  authService = inject(AuthService);

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.fetchCurrentUser().subscribe({
      next: () => {},
      error: (err) => {
        console.error('Failed to fetch current user:', err);
      },
    });
  }
}
