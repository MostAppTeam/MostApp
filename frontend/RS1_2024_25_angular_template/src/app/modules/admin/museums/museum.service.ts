import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Museum } from './museum.model';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

@Injectable({
  providedIn: 'root',
})
export class MuseumService {
  private apiUrl = 'https://localhost:7000/api/Museums';

  constructor(private http: HttpClient, private authService: MyAuthService) {
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log("Token koji se šalje:", token);  // Debug ispis
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }



  getMuseums(): Observable<Museum[]> {
    return this.http.get<Museum[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      responseType: 'json',
    });
  }

 /* createMuseum(museum: Omit<Museum, 'id'>): Observable<Museum> {
    const headers = this.getAuthHeaders();
    console.log('Zaglavlje za kreiranje muzeja:', headers); // Debug ispis
    return this.http.post<Museum>(this.apiUrl, museum, { headers });
  }*/

  createMuseum(museumData: FormData): Observable<Museum> {
    return this.http.post<Museum>(this.apiUrl, museumData);
  }



  updateMuseum(museum: Museum): Observable<Museum> {
    return this.http.put<Museum>(`${this.apiUrl}/${museum.id}`, museum, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteMuseum(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }


// Get sorted museums
  getSortedMuseums(sortBy: string, sortDirection: string): Observable<Museum[]> {
    const url = `${this.apiUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}`;
    return this.http.get<Museum[]>(url, {responseType: 'json'});
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, formData);
  }


}

