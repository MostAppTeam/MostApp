import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from './event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'https://localhost:7000/api/Event'; // Endpoint za Event API

  constructor(private http: HttpClient) {}

  // Dobijanje svih događaja
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  // Dodavanje novog događaja
  createEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  // Ažuriranje događaja
  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${event.id}`, event);
  }

  // Brisanje događaja
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
