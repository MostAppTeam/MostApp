import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MyAuthService {
  private apiUrl = 'https://localhost:7000';

  constructor(private httpClient: HttpClient) {}

  login(credentials: { username: string; password: string }) {
    return this.httpClient
      .post<{ token: string; myAuthInfo: any }>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (!response.token) {
            throw new Error('Token nije dobijen od servera.');
          }

          console.log('Token dobijen:', response.token);
          this.setToken(response.token);

          if (response.myAuthInfo) {
            console.log('Korisnički podaci:', response.myAuthInfo);
            this.setLoggedInUser(response.myAuthInfo);
          } else {
            console.warn('Korisnički podaci nisu prisutni.');
          }
        }),
        catchError((error) => {
          console.error('Greška prilikom prijave:', error);
          const errorMessage = error?.error?.message || 'Greška prilikom prijave. Molimo proverite podatke.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Registration method
  register(credentials: { username: string; firstName: string; lastName: string; email: string; password: string }) {
    return this.httpClient.post(`${this.apiUrl}/api/Auth/register`, credentials).pipe(
      catchError((error) => {
        console.error('Greška prilikom registracije:', error);
        const errorMessage = error?.error?.message || 'Registracija nije uspela. Pokušajte ponovo.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Store the token securely in localStorage
  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove token and user data during logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    console.log('User logged out successfully');
  }

  // Store user information in localStorage
  public setLoggedInUser(user: any): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  getLoggedInUser(): any {
    const userData = localStorage.getItem('loggedInUser');
    if (!userData) {
      console.error('No user data found in localStorage');
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    const user = this.getLoggedInUser();
    return user?.isAdmin || false;
  }

  // Check if the user is a manager
  isManager(): boolean {
    const user = this.getLoggedInUser();
    return user?.isManager || false;
  }

  // Check if the user is both admin and manager
  isAdminAndManager(): boolean {
    const user = this.getLoggedInUser();
    return user?.isAdmin && user?.isManager;
  }
}
