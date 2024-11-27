import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recommendation {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private apiUrl = 'http://localhost:7000/api/recommendations'; // Pravi API URL sa Swagger-a

  constructor(private http: HttpClient) {}

  getRecommendations(userId: number): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.apiUrl}/${userId}`);
  }
}
