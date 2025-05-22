import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  imports: [MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  fullName = '';
  userImage = 'https://i.pravatar.cc/150?img=32';
  userId = '682e1d12bd8776bf4e86c9ad';

  userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.goToProfile(),
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.http
      .get<any>(`http://localhost:3000/api/users/${this.userId}`)
      .subscribe({
        next: (user: any) => {
          console.log(user);
          this.fullName = `${user.firstName} ${user.lastName}`;
          if (user.avatarUrl) {
            this.userImage = user.avatarUrl;
          }
        },
        error: (err: Error) => {
          console.error('Failed to fetch user:', err);
        },
      });
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.http.post('/api/auth/logout', {}).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        console.error('Logout failed:', err);
      },
    });
  }
}
