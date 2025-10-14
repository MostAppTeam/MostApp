import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attraction } from './attractions.model';

@Injectable({
  providedIn: 'root',
})
export class AttractionsService {
  private apiUrl = 'https://localhost:7000/api/Attractions';

  constructor(private http: HttpClient) {}

  getAttractions(sortBy: string, sortDirection: string, category: string = 'All'): Observable<Attraction[]> {
    const url = `${this.apiUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}&category=${category}`;
    return this.http.get<Attraction[]>(url);
  }


  getAttraction(id: number): Observable<Attraction> {
    return this.http.get<Attraction>(`${this.apiUrl}/${id}`);
  }
}
