import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingCenter } from './shopping-center.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCenterService {
  private apiUrl = 'http://localhost:7000/api/ShoppingCenters';

  constructor(private http: HttpClient) {}

  getShoppingCenters(): Observable<ShoppingCenter[]> {
    return this.http.get<ShoppingCenter[]>(`${this.apiUrl}?sortBy=name`);
  }

  createShoppingCenter(center: Omit<ShoppingCenter, 'id' | 'city'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, center);
  }

  deleteShoppingCenter(centerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/ShoppingCenters/${centerId}`);
  }

}
