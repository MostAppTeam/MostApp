import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingCenter } from './shopping-center.model';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';// Ispravna putanja

@Injectable({
  providedIn: 'root',
})
export class ShoppingCenterService {
  private apiUrl = 'https://localhost:7000/api/ShoppingCenters';

  constructor(private http: HttpClient, private authService: MyAuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token:', token); // Log to verify token is available
    if (!token) {
      console.error('Token nije pronađen u AuthService.');
      throw new Error('Unauthorized: No token available');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }


  // Dobijanje svih shopping centara
  getShoppingCenters(sortBy: string, sortDirection: string): Observable<ShoppingCenter[]> {
    return this.http.get<ShoppingCenter[]>(
      `${this.apiUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createShoppingCenter(centerData: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'my-auth-token': `Bearer ${token}` // ✅ kao u muzeju
    });

    return this.http.post<any>(this.apiUrl, centerData, { headers });
  }



  deleteShoppingCenter(centerId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'my-auth-token': `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.apiUrl}/${centerId}`, { headers });
  }



  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'my-auth-token': `Bearer ${token}` // isto kao za muzeje
    });

    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<{ imageUrl: string }>(
      `${this.apiUrl}/upload-image`,
      formData,
      { headers }
    );
  }



}
