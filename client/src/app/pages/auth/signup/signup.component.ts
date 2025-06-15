import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../core/services/alerts/alert.service';
@Component({
  selector: 'app-signup',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm!: FormGroup;
  showPassword = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { fname, lname, email, password } = this.signupForm.value;

      const registerData = {
        firstName: fname,
        lastName: lname,
        email,
        password,
      };

      this.authService.register(registerData).subscribe({
        next: (res) => {
          console.log('Registration successful:', res);
          this.alertService.successToaster('User added!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration error:', err.error);
          this.alertService.errorToaster(err.error.message || err.error || 'Registration failed');
        },
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
