import { Component } from '@angular/core';
import { AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent {
  email: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private accountService: AccountService) {}

  sendActivationLink() {
    if (!this.email || !this.email.includes('@')) {
      this.errorMessage = 'Molimo unesite validan email.';
      return;
    }

    this.accountService.sendActivationLink(this.email).subscribe({
      next: () => {
        this.successMessage = 'Aktivacijski link je poslan!';
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Greška aktivacije:', err);
        this.errorMessage = err?.message || 'Greška prilikom slanja aktivacionog linka.';
      }
    });
  }


}
