import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private apiUrl = 'http://localhost:5000/api/Recommendations'; // Backend API ruta

  constructor(private http: HttpClient) {}

  getRecommendations(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }
}
