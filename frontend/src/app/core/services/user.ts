import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, IDashboardStats } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class User {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) { }

  getUsers(delay?: number): Observable<IUser[]> {
    let params = new HttpParams();
    if (delay) {
      params = params.set('delay', delay.toString());
    }
    return this.http.get<IUser[]>(this.apiUrl, { params });
  }

  getProfile(delay?: number): Observable<IUser> {
    let params = new HttpParams();
    if (delay) {
      params = params.set('delay', delay.toString());
    }
    return this.http.get<IUser>(`${this.apiUrl}/profile`, { params });
  }

  getDashboardStats(delay?: number): Observable<IDashboardStats> {
    let params = new HttpParams();
    if (delay) {
      params = params.set('delay', delay.toString());
    }
    return this.http.get<IDashboardStats>(`${this.apiUrl}/stats`, { params });
  }

  createUser(user: Partial<IUser>): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  updateUser(id: string, user: Partial<IUser>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
