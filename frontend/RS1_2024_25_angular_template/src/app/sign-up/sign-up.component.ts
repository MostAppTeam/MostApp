import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  email = '';
  password = '';
  confirmPassword = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router) {}

  // Update onSubmit to onSignUp to match the HTML
  onSignUp(signupForm: any): void {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Reset messages
    this.successMessage = null;
    this.errorMessage = null;

    if (!passwordRegex.test(this.password)) {
      this.errorMessage = 'Password must be at least 8 characters long, and include at least one letter, one number, and one special character (@$!%*?&)';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    if (!signupForm.valid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    // Simulate a successful registration
    this.successMessage = 'Registration successful! Please log in.';
    this.router.navigate(['/login']);
  }
}
