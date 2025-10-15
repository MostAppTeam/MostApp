import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attraction } from './attractions.model';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
type CreateAttractionPayload = {
  name: string;
  description?: string;
  cityID: number;
  virtualTourURL?: string;
  imageUrl?: string;
};

@Injectable({ providedIn: 'root' })
export class AttractionsService {
  private apiBase = 'https://localhost:7000';
  private apiUrl = `${this.apiBase}/api/Attractions`;

  constructor(private http: HttpClient, private authService: MyAuthService) {}

  /** Header kao u MuseumService: my-auth-token: Bearer <token> */
  private buildAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // npr. vrati JWT ili custom token string
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('my-auth-token', `Bearer ${token}`);
    }
    return headers;
  }

  /** Public GET (bez auth headera) */
  getAttractions(sortBy: string, sortDirection: string): Observable<Attraction[]> {
    const params = new HttpParams().set('sortBy', sortBy).set('sortDirection', sortDirection);
    return this.http.get<Attraction[]>(this.apiUrl, { params });
  }

  /** POST kreiranje (zaštićeno) */
  createAttraction(payload: CreateAttractionPayload): Observable<Attraction> {
    const headers = this.buildAuthHeaders();
    return this.http.post<Attraction>(this.apiUrl, payload, { headers });
  }

  /** Upload slike (zaštićeno). Ne postavljati Content-Type ručno za FormData. */
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const fd = new FormData();
    fd.append('file', file);
    const headers = this.buildAuthHeaders();
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, fd, { headers });
  }
}
