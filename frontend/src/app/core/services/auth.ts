import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoginRequest, ILoginResponse, IUser } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:5000/api/auth';
  private userSubject = new BehaviorSubject<IUser | null>(null);
  public user$ = this.userSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  login(credentials: ILoginRequest, delay?: number): Observable<ILoginResponse> {
    let params = new HttpParams();
    if (delay) {
      params = params.set('delay', delay.toString());
    }
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, credentials, { params });
  }

  setToken(token: string, user: IUser): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): IUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }

  isGeneralUser(): boolean {
    return this.getUser()?.role === 'user';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private checkToken(): void {
    const token = this.getToken();
    const user = this.getUser();
    if (token && user) {
      this.userSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }
}
