import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  temperature: number | null = null; // Za temperaturu
  humidity: number | null = null;    // Za vlagu
  description: string | null = null; // Za opis vremena
  errorMessage: string | null = null; // Za greške

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getWeatherData();
  }

  getWeatherData(): void {
    //const apiUrl = 'http://localhost:7000/weather';
    //const apiUrl = 'http://localhost:7000/api/weather';
    const city = 'Mostar';
    const apiUrl = `http://localhost:7000/api/weather/${city}`;

// Backend URL za vremensku prognozu
    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        console.log('Weather data fetched successfully:', data);
        this.temperature = data.main?.temp || null;
        this.humidity = data.main?.humidity || null;
        this.description = data.weather?.[0]?.description || 'No description available';
      },
      error: (err) => {
        console.error('Error fetching weather data:', err);
        this.errorMessage = 'Unable to fetch weather data at this time.';
      },
    });

  }
}
