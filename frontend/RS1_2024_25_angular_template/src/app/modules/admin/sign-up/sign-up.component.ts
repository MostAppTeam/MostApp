import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';// Ispravna putanja

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  step = 1;
  username = '';
  email = '';
  firstName = '';
  lastName = '';
  password = '';
  confirmPassword = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: MyAuthService) {}

  nextStep(): void {
    if (this.step === 1 && (!this.username || !this.email || !this.isValidEmail(this.email))) {
      this.errorMessage = 'Please enter a valid username and email.';
      return;
    }

    if (this.step === 2 && (!this.password || !this.confirmPassword || this.password !== this.confirmPassword || !this.isValidPassword(this.password))) {
      this.errorMessage = 'Passwords must match and meet the security criteria.';
      return;
    }

    this.errorMessage = null;
    this.step++;
  }

  previousStep(): void {
    this.errorMessage = null;
    this.step--;
  }

  onSubmit(): void {
    const user = {
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Please log in.';
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error: any) => { // Dodan tip za `error`
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        this.successMessage = null;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}
