import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MyAuthService {
  private apiUrl = 'http://localhost:7000';

  constructor(private httpClient: HttpClient) {}

  // Metoda za login sa rukovanjem greškama
  login(credentials: { username: string; password: string }) {
    return this.httpClient
      .post<{ token: string; myAuthInfo: any }>(`${this.apiUrl}/api/Auth/login`, credentials)
      .pipe(
        tap((response) => {
          // Čuvanje tokena i korisničkih podataka nakon uspešne prijave
          localStorage.setItem('token', response.token);
          this.setLoggedInUser(response.myAuthInfo);
        }),
        catchError((error) => {
          console.error('Login error:', error);
          const errorMessage = error?.error?.message || 'Login failed. Please check your credentials.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Metoda za registraciju (nije menjana)
  register(credentials: { username: string; firstName: string; lastName: string; email: string; password: string }) {
    return this.httpClient.post(`${this.apiUrl}/api/Auth/register`, credentials).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        const errorMessage = error?.error?.message || 'Registration failed. Please try again.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Postavljanje korisnika u localStorage
  setLoggedInUser(user: any): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  // Dohvati token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Proveri da li je korisnik prijavljen
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Odjava korisnika
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    console.log('User logged out successfully');
  }
}
