import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getMessages(userId1: string, userId2: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/messages/${userId1}/${userId2}`
    );
  }

  sendMessage(message: any) {
    return this.http.post(`${this.apiUrl}/messages`, message);
  }
}
