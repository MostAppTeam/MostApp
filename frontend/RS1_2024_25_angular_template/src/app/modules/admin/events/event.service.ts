import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from './event.model';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'https://localhost:7000/api/Event';

  constructor(private http: HttpClient, private authService: MyAuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'my-auth-token': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  // === UPLOAD SLIKE ===
  // POST: /api/Event/upload-image
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(
      `${this.apiUrl}/upload-image`,
      formData,
      { headers: new HttpHeaders({ 'my-auth-token': `Bearer ${this.authService.getToken()}` }) }
    );
  }

  // === VEZIVANJE SLIKE ZA EVENT ===
  // PUT: /api/Event/{id}/image
  setEventImage(id: number, imageUrl: string): Observable<{ message: string; imageUrl: string }> {
    return this.http.put<{ message: string; imageUrl: string }>(
      `${this.apiUrl}/${id}/image`,
      JSON.stringify(imageUrl),
      { headers: this.getAuthHeaders() }
    );
  }

  // === BRISANJE SLIKE ===
  // DELETE: /api/Event/delete-image?imageUrl=/images/events/xxx.jpg
  deleteImage(imageUrl: string): Observable<void> {
    const params = new HttpParams().set('imageUrl', imageUrl);
    return this.http.delete<void>(`${this.apiUrl}/delete-image`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  // === DOHVAT SVIH DOGAĐAJA ===
  getEvents(
    name?: string,
    date?: string,
    location?: string,
    description?: string,
    sortBy: string = 'date'
  ): Observable<Event[]> {
    let params = new HttpParams().set('sortBy', sortBy);

    if (name) params = params.set('name', name);
    if (date) params = params.set('date', date);
    if (location) params = params.set('location', location);
    if (description) params = params.set('description', description);

    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  // === DETALJ JEDNOG EVENTA ===
  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  // === KREIRAJ NOVI EVENT ===
  createEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event, {
      headers: this.getAuthHeaders(),
    });
  }

  // === AŽURIRAJ EVENT ===
  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${event.id}`, event, {
      headers: this.getAuthHeaders(),
    });
  }

  // === OBRIŠI EVENT ===
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
