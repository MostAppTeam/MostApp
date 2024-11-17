import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Museum } from './museum.model';

@Injectable({
  providedIn: 'root',
})
export class MuseumService {
  private apiUrl = 'http://localhost:7000/api/Museums'; // Ispravljen API URL

  constructor(private http: HttpClient) {}

  // Dobijanje svih muzeja
  getMuseums(): Observable<Museum[]> {
    return this.http.get<Museum[]>(this.apiUrl);
  }

  // Dodavanje novog muzeja
  createMuseum(museum: Omit<Museum, 'id'>): Observable<Museum> {
    // Slanje bez `id` jer ga backend automatski generiše
    return this.http.post<Museum>(this.apiUrl, museum);
  }

  // Ažuriranje muzeja
  updateMuseum(museum: Museum): Observable<Museum> {
    return this.http.put<Museum>(`${this.apiUrl}/${museum.id}`, museum);
  }

  // Brisanje muzeja
  deleteMuseum(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
