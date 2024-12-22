import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'https://localhost:5001/api/reports/generate'; // Promijenite prema vašem backend API-ju

  constructor(private http: HttpClient) {}

  downloadReport(id: string, startDate: string, endDate: string) {
    const params = { id, startDate, endDate };
    return this.http.get(this.apiUrl, {
      params,
      responseType: 'blob', // Za preuzimanje binarnog sadržaja
    });
  }
}
