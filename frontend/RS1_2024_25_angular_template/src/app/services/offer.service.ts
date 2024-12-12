import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from '../modules/admin/offers/offer.model';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private apiUrl = 'http://localhost:7000/api/offers';

  constructor(private http: HttpClient) {}

  // Dohvatanje svih ponuda
  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl);
  }

  // Kreiranje PayPal narudžbe
  createPayPalOrder(offerName: string, amount: number): Observable<any> {
    const body = { offerName, amount };
    return this.http.post<any>(`${this.apiUrl}/create-paypal-order`, body);
  }
}
