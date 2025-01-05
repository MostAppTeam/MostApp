import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Museum } from './museum.model';

@Injectable({
  providedIn: 'root',
})
export class MuseumService {
  private apiUrl = 'https://localhost:7000/api/Museums'; // Corrected API URL

  constructor(private http: HttpClient) {}

  // Get all museums
  getMuseums(): Observable<Museum[]> {
    return this.http.get<Museum[]>(this.apiUrl, { responseType: 'json' });
  }

  // Add a new museum
  createMuseum(museum: Omit<Museum, 'id'>): Observable<Museum> {
    return this.http.post<Museum>(this.apiUrl, museum);
  }

  // Update a museum
  updateMuseum(museum: Museum): Observable<Museum> {
    return this.http.put<Museum>(`${this.apiUrl}/${museum.id}`, museum);
  }

  // Get sorted museums
  getSortedMuseums(sortBy: string, sortDirection: string): Observable<Museum[]> {
    const url = `${this.apiUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}`;
    return this.http.get<Museum[]>(url, { responseType: 'json' });
  }

  // Delete a museum
  deleteMuseum(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
