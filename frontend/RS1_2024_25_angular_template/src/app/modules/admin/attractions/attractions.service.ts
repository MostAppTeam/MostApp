import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private buildAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('my-auth-token', `Bearer ${token}`);
    }
    return headers;
  }

  getAttractions(sortBy: string, sortDirection: string, category: string = 'All'): Observable<Attraction[]> {
    const url = `${this.apiUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}&category=${category}`;
    return this.http.get<Attraction[]>(url);
  }

  createAttraction(payload: CreateAttractionPayload): Observable<Attraction> {
    const headers = this.buildAuthHeaders();
    return this.http.post<Attraction>(this.apiUrl, payload, { headers });
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const fd = new FormData();
    fd.append('file', file);
    const headers = this.buildAuthHeaders();
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, fd, { headers });
  }

  getAttraction(id: number): Observable<Attraction> {
    return this.http.get<Attraction>(`${this.apiUrl}/${id}`);
  }
}
