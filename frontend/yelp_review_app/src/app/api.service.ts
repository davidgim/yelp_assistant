import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getAllLocations(): Observable<{ state: string, city: string }[]> { 
    return this.http.get<any>(`${this.baseUrl}/locations`);
  }

  searchBusinesses(state: string, city: string, category: string, businessName: string): Observable<any> {
    let params = new HttpParams;
    if (state) params = params.set('state', state);
    if (city) params = params.set('city', city);
    if (category) params = params.set('category', category);
    if (businessName) params = params.set('businessName', businessName);
    return this.http.get(`${this.baseUrl}/search`, { params });
  }

  summarizeBusiness(businessId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/summarize`, { businessId });
  }

  getStates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/states`);
  }

  getCities(state: string): Observable<string[]> {
    let params = new HttpParams;
    if (state) params = params.set('state', state);
    return this.http.get<string[]>(`${this.baseUrl}/cities`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }
}
