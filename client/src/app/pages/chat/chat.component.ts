import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../core/services/socket/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  messageText = '';
  currentUser = 'user';
  defaultAvatar = 'https://i.pravatar.cc/150?img=32';
  typingAvatar = 'https://i.pravatar.cc/150?img=45';
  isTyping = false;
  groupedMessages: any[] = [];

  private socketSubscription!: Subscription;
  private typingTimeout: any;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.connect();

    this.socketSubscription = this.socketService
      .onMessage()
      .subscribe((msg) => {
        console.log('Received message from server:', msg);
        this.messages.push(msg);
        this.groupMessagesByDate();
      });

    this.groupMessagesByDate();
  }

  ngOnDestroy() {
    this.socketSubscription?.unsubscribe();
    this.socketService.disconnect(); // <- disconnect the socket
  }

  sendMessage() {
    if (!this.messageText.trim()) return;

    const message = {
      sender: this.currentUser,
      content: this.messageText,
      timestamp: new Date(),
      avatarUrl: this.defaultAvatar,
    };

    this.socketService.sendMessage(message);
    this.messages.push(message);
    this.messageText = '';
    this.isTyping = false;
    this.groupMessagesByDate();
  }

  groupMessagesByDate() {
    const grouped: { [key: string]: any[] } = {};

    for (const msg of this.messages) {
      const dateKey = new Date(msg.timestamp).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(msg);
    }

    this.groupedMessages = Object.entries(grouped)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, messages]) => ({
        date,
        messages: messages.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
      }));
  }

  handleTyping() {
    this.isTyping = true;
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
    }, 2000);
  }
}
