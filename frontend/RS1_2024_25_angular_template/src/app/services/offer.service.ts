import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from '../modules/admin/offers/offer.model';
@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private apiUrl = 'http://localhost:7000/api/offers'; // Provjeri da li API endpoint radi

  constructor(private http: HttpClient) {}

  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl);
  }
}

