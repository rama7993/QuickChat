import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../../core/services/socket/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FilterPipe } from '../../../core/pipes/filter/filter.pipe';
import { ChatService } from '../../../core/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, FilterPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private socketService = inject(SocketService);
  private chatService = inject(ChatService);

  users: any[] = [];
  messages: any[] = [];
  groupedMessages: { date: string; messages: any[] }[] = [];
  selectedUser: any = null;

  messageText = '';
  searchText = '';
  currentUser = this.authService.currentUser;
  defaultAvatar = 'https://i.pravatar.cc/150?img=32';
  isTyping = false;

  private socketSubscription!: Subscription;
  private typingTimeout: any;
  private activeRoomId = '';

  ngOnInit() {
    this.loadUsers();

    this.socketSubscription = this.socketService
      .onMessage()
      .subscribe((msg) => {
        // msg has {roomId, message}
        if (msg.roomId === this.activeRoomId) {
          this.messages.push(msg.message);
          this.groupMessagesByDate();
        }
      });

    this.socketService.onTyping().subscribe(({ user }) => {
      if (this.selectedUser && user._id === this.selectedUser._id) {
        this.isTyping = true;
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => (this.isTyping = false), 1500);
      }
    });
  }

  ngOnDestroy() {
    this.socketSubscription?.unsubscribe();
    this.socketService.disconnect();
  }

  loadUsers() {
    this.chatService.getUsers().subscribe((resp) => {
      this.users = resp.filter((u) => u._id !== this.currentUser()?._id);
    });
  }

  selectUser(user: any) {
    if (this.activeRoomId) {
      this.socketService.leaveRoom(this.activeRoomId);
    }

    this.selectedUser = user;
    this.messages = [];
    this.groupedMessages = [];

    this.activeRoomId = this.generateRoomId(this.currentUser()._id, user._id);
    this.socketService.joinRoom(this.activeRoomId);

    // Load previous messages from backend
    this.chatService
      .getMessages(this.currentUser()._id, user._id)
      .subscribe((msgs) => {
        this.messages = msgs;
        this.groupMessagesByDate();
      });
  }

  generateRoomId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }

  sendMessage() {
    if (!this.messageText.trim() || !this.selectedUser) return;

    const message: any = {
      sender: this.currentUser()._id,
      receiver: this.selectedUser._id,
      content: this.messageText.trim(),
      timestamp: new Date(),
      avatarUrl: this.currentUser().photoUrl || this.defaultAvatar,
    };

    // Send via socket
    this.socketService.sendMessage(this.activeRoomId, message);

    // Send via REST to store in DB
    this.chatService.sendMessage(message).subscribe();

    // Optimistically add message locally
    this.messages.push(message);
    this.groupMessagesByDate();

    this.messageText = '';
  }

  handleTyping() {
    if (!this.activeRoomId || !this.currentUser()) return;
    this.socketService.typing(this.activeRoomId, this.currentUser());
  }

  groupMessagesByDate() {
    const grouped: { [date: string]: any[] } = {};

    this.messages.forEach((msg) => {
      const dateKey = new Date(msg.timestamp).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });

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
}
