import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from './offer.model';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private apiUrl = 'https://localhost:7000/api/Offers';

  constructor(private http: HttpClient) {}

  getOffers(filters: { minPrice?: number; maxPrice?: number; category?: string; sortBy?: string } = {}): Observable<Offer[]> {
    let params = new HttpParams();

    if (filters.minPrice) params = params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.append('maxPrice', filters.maxPrice.toString());
    if (filters.category) params = params.append('category', filters.category);
    if (filters.sortBy) params = params.append('sortBy', filters.sortBy);

    return this.http.get<Offer[]>(this.apiUrl, { params });
  }

  createPayPalOrder(offerName: string, price: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createPayPalOrder`, { offerName, price });
  }
}
