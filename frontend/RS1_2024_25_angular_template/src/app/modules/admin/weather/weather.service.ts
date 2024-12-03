import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:7000/weather';
  // API URL iz Swaggera

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    //return this.http.get(`${this.apiUrl}?city=${city}`);
    return this.http.get(`${this.apiUrl}/${city}`);

  }
}
