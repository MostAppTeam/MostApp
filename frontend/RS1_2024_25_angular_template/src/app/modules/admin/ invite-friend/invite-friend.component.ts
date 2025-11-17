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
    console.log('Sending invitation to email:', this.friendEmail);
    this.accountService.sendInvite(this.friendEmail).subscribe({
      next: () => {
        this.successMessage = 'Invitation has been sent!';
        console.log('Invitation successfully sent.');
      },
      error: (err) => {
        console.error('Invitation error:', err);
        this.errorMessage = err?.message || 'Error while sending the invitation.';
      }
    });
  }
}
