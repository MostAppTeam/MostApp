import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  newPassword: string = '';
  token: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.errorMessage = 'Token nije pronađen u URL-u.';
    }

  }

  onResetPassword() {
    console.log('Reset lozinke sa tokenom:', this.token);
    if (!this.newPassword) {
      this.errorMessage = 'Molimo unesite novu lozinku.';
      return;
    }

    this.accountService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.successMessage = 'Lozinka je uspešno resetovana!';
        console.log('Lozinka resetovana.');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error('Greška prilikom resetovanja lozinke:', err);
        this.errorMessage = err?.message || 'Greška prilikom resetovanja lozinke.';
      }
    });
  }

}
