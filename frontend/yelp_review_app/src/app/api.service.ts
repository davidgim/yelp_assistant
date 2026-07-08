import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllLocations(page: number = 1, perPage: number = 50): Observable<{ 
    locations: { state: string, city: string }[],
    total: number,
    page: number,
    per_page: number,
    total_pages: number
  }> { 
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<any>(`${this.baseUrl}/location/locations`, { params });
  }
  
  // New method to get all locations without pagination
  getAllLocationsNoPagination(): Observable<{ 
    locations: { state: string, city: string }[],
    total: number,
    page: number,
    per_page: number,
    total_pages: number
  }> { 
    let params = new HttpParams().set('per_page', '0'); // Special value to request all
    return this.http.get<any>(`${this.baseUrl}/location/locations`, { params });
  }

  searchBusinesses(state: string, city: string, category: string, businessName: string): Observable<any> {
    let params = new HttpParams;
    if (state) params = params.set('state', state);
    if (city) params = params.set('city', city);
    if (category) params = params.set('category', category);
    if (businessName) params = params.set('businessName', businessName);
    return this.http.get(`${this.baseUrl}/business/search`, { params });
  }

  getBusinessInformation(businessId: string): Observable<any> {
    let params = new HttpParams;
    if (businessId) params = params.set('business_id', businessId);
    return this.http.get(`${this.baseUrl}/business/search/information`, { params });
  }

  summarizeBusiness(businessId: string, userId?: string): Observable<any> {
    const body = userId ? { businessId, userId } : { businessId }
    return this.http.post(`${this.baseUrl}/business/summarize`, body);
  }

  getStates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/location/states`);
  }

  getCities(state: string): Observable<string[]> {
    let params = new HttpParams;
    if (state) params = params.set('state', state);
    return this.http.get<string[]>(`${this.baseUrl}/location/cities`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/business/categories`);
  }

  getUserMetadata(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/metadata`, { params: { user_id: userId } });
  }

  updateUserMetadata(userId: string, metadata: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/user/metadata`, { user_id: userId, ...metadata });
  }

  updateFavoriteBusiness(userId: string, newFavorite: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/user/metadata/businesses/add`, { user_id: userId, new_favorite: newFavorite});
  }

  deleteFavoriteBusiness(userId: string, toDelete: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/user/metadata/businesses/delete`, { user_id: userId, to_delete: toDelete});
  }

  addDietaryRestriction(userId: string, newRestriction: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/user/metadata/diet/add`, {user_id: userId, new_restriction: newRestriction});
  }

  deleteDietaryRestriction(userId: string, toDelete: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/user/metadata/diet/delete`, {user_id: userId, to_delete: toDelete});
  }
}
