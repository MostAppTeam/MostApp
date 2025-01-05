import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// No need to import CommonModule here.

export interface Recommendation {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private apiUrl = 'https://localhost:7000/api/recommendations'; // API URL

  constructor(private http: HttpClient) {}

  getRecommendations(userId: number): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.apiUrl}/${userId}`);
  }
}
