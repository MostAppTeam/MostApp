import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = 'https://localhost:7000/api/Account'; // API za Account funkcionalnosti

  constructor(private http: HttpClient) {}

  sendActivationLink(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-activation-link`, { email }).pipe(
      catchError((error) => {
        console.error('Greška prilikom slanja aktivacionog linka:', error);
        return throwError(() => new Error(error?.error?.message || 'Greška prilikom slanja aktivacionog linka.'));
      })
    );
  }


  // Resetovanje lozinke - slanje linka
  sendPasswordResetLink(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-password-reset-link`, { email }).pipe(
      catchError((error) => {
        console.error('Greška prilikom slanja linka za resetovanje lozinke:', error);
        return throwError(() => new Error(error?.error?.message || 'Greška prilikom slanja linka za resetovanje lozinke.'));
      })
    );
  }

  // Resetovanje lozinke - nova lozinka
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
      catchError((error) => {
        console.error('Greška prilikom resetovanja lozinke:', error);
        return throwError(() => new Error(error?.error?.message || 'Greška prilikom resetovanja lozinke.'));
      })
    );
  }

  // Pozivanje prijatelja
  sendInvite(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-invite`, { email }).pipe(
      catchError((error) => {
        console.error('Greška prilikom slanja pozivnice:', error);
        return throwError(() => new Error(error?.error?.message || 'Greška prilikom slanja pozivnice.'));
      })
    );
  }
}
