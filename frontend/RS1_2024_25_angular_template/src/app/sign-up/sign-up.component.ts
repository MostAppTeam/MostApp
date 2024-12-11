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

  constructor(private router: Router) {}

  // Update onSubmit to onSignUp to match the HTML
  onSignUp(signupForm: any): void {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(this.password)) {
      alert(
        'Password must be at least 8 characters long, and include at least one letter, one number, and one special character (@$!%*?&)'
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!signupForm.valid) {
      alert('Please fill in all fields correctly.');
      return;
    }

    // Simulate a successful registration
    alert('Registration successful! Please log in.');
    this.router.navigate(['/login']);
  }
}
