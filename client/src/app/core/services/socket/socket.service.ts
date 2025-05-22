import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:3000');
    }
  }

  sendMessage(message: any) {
    this.socket?.emit('chat message', message);
  }

  onMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket?.on('chat message', (data) => observer.next(data));
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}
