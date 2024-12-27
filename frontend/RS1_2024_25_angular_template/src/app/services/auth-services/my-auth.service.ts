import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MyAuthService {
  private apiUrl = 'http://localhost:7000';

  constructor(private httpClient: HttpClient) {}

  // Login method with improved error handling and token management
  login(credentials: { username: string; password: string }) {
    return this.httpClient
      .post<{ token: string; myAuthInfo: any }>(`${this.apiUrl}/api/Auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (!response.token) {
            throw new Error('Token nije dobijen od servera.');
          }

          // Save token securely
          console.log('Token dobijen:', response.token);
          this.setToken(response.token);

          // Save user information if available
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
  private setToken(token: string): void {
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
    try {
      const user = localStorage.getItem('loggedInUser');
      if (!user) {
        return null; // Return null if no user data is found
      }
      return JSON.parse(user);
    } catch (error) {
      console.error('Greška prilikom parsiranja korisničkih podataka iz localStorage:', error);
      return null;
    }
  }


  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check if the user has a specific role
  hasRole(role: string): boolean {
    const user = this.getLoggedInUser();
    return user?.roles?.includes(role) || false;
  }

  // Check if the user is both admin and manager
  isAdminAndManager(): boolean {
    const user = this.getLoggedInUser();
    return user?.roles?.includes('Admin') && user?.roles?.includes('Manager');
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  // Check if the user is a manager
  isManager(): boolean {
    return this.hasRole('Manager');
  }
}
