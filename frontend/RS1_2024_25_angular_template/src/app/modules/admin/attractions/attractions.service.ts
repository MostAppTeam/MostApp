import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attraction } from './attractions.model'; // Importuj model tipa Attraction

@Injectable({
  providedIn: 'root',
})
export class AttractionsService {
  private apiUrl = 'http://localhost:7000/api/Attractions'; // Backend API URL

  constructor(private http: HttpClient) {}

  // Metoda za dohvat atrakcija
  getAttractions(): Observable<Attraction[]> {
    return this.http.get<Attraction[]>(this.apiUrl); // Vraća Observable sa listom atrakcija
  }
}
