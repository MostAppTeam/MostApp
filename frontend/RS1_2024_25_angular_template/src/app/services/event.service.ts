import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ovaj servis je dostupan svuda u aplikaciji
})
export class EventService {
  private apiUrl = 'https://localhost:7000/api'; // Endpoint za Event API

  constructor(private http: HttpClient) {}

  // Dobijanje svih događaja
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  // Dodavanje novog događaja
  addEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  // Ažuriranje postojećeg događaja
  updateEvent(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  // Brisanje događaja
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
