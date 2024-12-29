import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attraction } from './attractions.model';

@Injectable({
  providedIn: 'root',
})
export class AttractionsService {
  private apiUrl = 'https://localhost:7000/api/Attractions'; // Backend API URL

  constructor(private http: HttpClient) {}

  // Metoda za dohvat atrakcija sa parametrima za sortiranje
  getAttractions(sortBy: string, sortDirection: string): Observable<Attraction[]> {
    const url = `${this.apiUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}`;
    return this.http.get<Attraction[]>(url); // Vraća Observable sa listom atrakcija
  }
}
