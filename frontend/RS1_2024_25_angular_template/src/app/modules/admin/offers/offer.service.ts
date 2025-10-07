import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from './offer.model';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private apiUrl = 'https://localhost:7000/api/Offers';

  constructor(private http: HttpClient) {
  }

  getOffers(filters: {
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    sortBy?: string
  } = {}): Observable<Offer[]> {
    let params = new HttpParams();

    if (filters.minPrice != null) params = params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice != null) params = params.append('maxPrice', filters.maxPrice.toString());
    if (filters.category) params = params.append('category', filters.category);
    if (filters.sortBy) params = params.append('sortBy', filters.sortBy);

    return this.http.get<Offer[]>(this.apiUrl, {params});
  }

  // Kreiranje PayPal narudžbe
  createPayPalOrder(offerName: string, amount: number): Observable<any> {
    const body = { offerName, amount };
    return this.http.post<any>(`${this.apiUrl}/create-paypal-order`, body);
  }
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, formData);
  }
}
