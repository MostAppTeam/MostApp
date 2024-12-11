import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: MyAuthService, private router: Router) {}

  onLogin(form: any) {
    const loginData = {
      username: form.value.username,
      password: form.value.password
    };

    // Pozivanje funkcije za autentifikaciju
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.authService.setLoggedInUser(response); // Spremanje korisničkih podataka u localStorage
        this.successMessage = 'Login successful!';
        this.errorMessage = null;
        this.router.navigate(['/home']); // Preusmjeravanje na home stranicu
      },
      error: () => {
        this.errorMessage = 'Invalid username or password.';
        this.successMessage = null;
      }
    });
  }
}
