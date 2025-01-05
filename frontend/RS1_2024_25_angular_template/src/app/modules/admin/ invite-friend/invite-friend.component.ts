import { Component } from '@angular/core';
import { AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-invite-friend',
  templateUrl: './invite-friend.component.html',
  styleUrls: ['./invite-friend.component.css']
})
export class InviteFriendComponent {
  friendEmail: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private accountService: AccountService) {
  }

  sendInvite() {
    console.log('Slanje pozivnice za email:', this.friendEmail);
    this.accountService.sendInvite(this.friendEmail).subscribe({
      next: () => {
        this.successMessage = 'Pozivnica je poslana!';
        console.log('Pozivnica uspješno poslana.');
      },
      error: (err) => {
        console.error('Greška pozivnice:', err);
        this.errorMessage = err?.message || 'Greška prilikom slanja pozivnice.';
      }
    });
  }
}
