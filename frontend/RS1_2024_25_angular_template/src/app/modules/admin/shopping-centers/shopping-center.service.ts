import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingCenter } from './shopping-center.model';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCenterService {
  private apiUrl = 'https://localhost:7000/api/ShoppingCenters';

  constructor(private http: HttpClient, private authService: MyAuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token nije pronađen u AuthService.');
      throw new Error('Unauthorized: No token available');
    }
    return new HttpHeaders({
      'my-auth-token': `Bearer ${token}`,
    });
  }

  // 🟢 Za admin/manager: GET sa tokenom
  getShoppingCenters(sortBy: string, sortDirection: string): Observable<ShoppingCenter[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ShoppingCenter[]>(`${this.apiUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}`, { headers });
  }

  // 🟢 Za sve korisnike: GET bez tokena
  getShoppingCentersForAll(sortBy: string, sortDirection: string): Observable<ShoppingCenter[]> {
    return this.http.get<ShoppingCenter[]>(`${this.apiUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}`);
  }

  createShoppingCenter(centerData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, centerData, { headers });
  }

  deleteShoppingCenter(centerId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${centerId}`, { headers });
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const headers = this.getAuthHeaders();
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, formData, { headers });
  }

  getShoppingCenterById(id: number): Observable<ShoppingCenter> {
    const headers = this.getAuthHeaders();
    return this.http.get<ShoppingCenter>(`${this.apiUrl}/${id}`, { headers });
  }
  getShoppingCenterByIdForAll(id: number): Observable<ShoppingCenter> {
    return this.http.get<ShoppingCenter>(`${this.apiUrl}/${id}`);
  }

}

