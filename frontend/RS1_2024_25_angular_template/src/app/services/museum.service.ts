import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ovaj servis je dostupan svuda u aplikaciji
})
export class MuseumService {
  private apiUrl = 'http://localhost:7000/api'; // Zamijeni sa stvarnim URL-om

  constructor(private http: HttpClient) {}

  // CRUD operacije za muzeje
  getMuseums(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  addMuseum(museum: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, museum);
  }

  updateMuseum(id: number, museum: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, museum);
  }

  deleteMuseum(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
