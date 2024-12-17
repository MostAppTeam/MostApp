import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms'; // Dodajemo NgForm
import { MyAuthService } from '../../../services/auth-services/my-auth.service'; // Importovanje MyAuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: MyAuthService, private router: Router) {}

  // onLogin metodda, pozivamo login sa servisom
  onLogin(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    const loginData = {
      username: form.value.username.trim(),
      password: form.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response); // Log za proveru odgovora
        this.successMessage = 'Welcome! Login successful.';
        this.errorMessage = null;

        // Setuj korisnika u localStorage
        this.authService.setLoggedInUser(response.myAuthInfo);

        // Spremi token
        localStorage.setItem('token', response.token);

        // Preusmeri korisnika na home
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (err) => {
        console.error('Login error:', err); // Log za greške
        this.errorMessage = err?.message || 'Invalid username or password.';
        this.successMessage = null;
      }
    });
  }
}
