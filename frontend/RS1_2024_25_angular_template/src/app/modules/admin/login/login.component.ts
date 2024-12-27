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

  onLogin(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Molimo unesite korisničko ime i šifru.';
      return;
    }

    const loginData = {
      username: form.value.username.trim(),
      password: form.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login uspešan:', response);

        if (!response.token) {
          this.errorMessage = 'Server nije poslao validan token.';
          return;
        }

        this.successMessage = 'Dobrodošli! Uspešna prijava.';
        this.errorMessage = null;

        this.authService.setToken(response.token);

        if (response.myAuthInfo) {
          this.authService.setLoggedInUser(response.myAuthInfo);
        } else {
          console.warn('Korisnički podaci nisu prisutni u odgovoru servera.');
        }

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (err) => {
        console.error('Greška prilikom prijave:', err);
        this.errorMessage = err?.message || 'Pogrešno korisničko ime ili šifra.';
        this.successMessage = null;
      }
    });
  }

}
