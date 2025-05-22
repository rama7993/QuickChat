import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/login`,
      { email, password },
      {
        withCredentials: true,
      }
    );
  }

  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.API_URL}/me`, {
      withCredentials: true,
    });
  }
}
