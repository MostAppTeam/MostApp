import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  createEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event, {
      headers: this.getAuthHeaders() });
  }

  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${event.id}`, event, {
      headers: this.getAuthHeaders() });
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders() });
  }
}
