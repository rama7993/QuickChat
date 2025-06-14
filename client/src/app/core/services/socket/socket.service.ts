import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl);
  }

  joinRoom(roomId: string) {
    this.socket.emit('join room', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket.emit('leave room', roomId);
  }

  sendMessage(roomId: string, message: any) {
    console.log('Sending message via socket:', roomId, message);
    this.socket.emit('chat message', { roomId, message });
  }

  typing(roomId: string, user: any) {
    this.socket.emit('typing', { roomId, user });
  }

  onMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('chat message', (msg) => observer.next(msg));
    });
  }

  onTyping(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('typing', (data) => observer.next(data));
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
