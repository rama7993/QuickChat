import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  profileForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  currentUser = this.authService.currentUser;

  ngOnInit() {
    this.buildForm();
    console.log(this.currentUser());
    this.profileForm.patchValue(this.currentUser());
  }

  buildForm() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      bio: [''],
      age: [null, [Validators.min(18)]],
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
      photoUrl: [''],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.profileForm.patchValue({ photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      const userId = this.currentUser()?._id;

      if (!userId) return;

      this.authService.updateUserById(userId, formData).subscribe({
        next: (updatedUser) => {
          this.authService.updateUser(updatedUser);
          console.log('User updated:', updatedUser);
        },
        error: (err) => {
          console.error('Update failed', err);
        },
      });
    }
  }
}
