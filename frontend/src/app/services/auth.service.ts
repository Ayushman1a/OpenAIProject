import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { LoginRequest } from '../models/login-request';
import { SignupRequest } from '../models/signup-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenStorageKey = 'travelAuthToken';
  private readonly usernameStorageKey = 'travelAuthUsername';
  private readonly rolesStorageKey = 'travelAuthRoles';

  constructor(private http: HttpClient, private router: Router) {}

  signup(signupRequest: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', signupRequest).pipe(
      tap(response => this.saveAuthData(response))
    );
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', loginRequest).pipe(
      tap(response => this.saveAuthData(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.usernameStorageKey);
    localStorage.removeItem(this.rolesStorageKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenStorageKey);
  }

  isAdmin(): boolean {
    return this.getUserRoles().includes('ADMIN');
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameStorageKey);
  }

  getUserRoles(): string[] {
    const data = localStorage.getItem(this.rolesStorageKey);
    if (!data) {
      return [];
    }

    try {
      const roles = JSON.parse(data) as string[];
      return Array.isArray(roles) ? roles : [];
    } catch {
      return [];
    }
  }

  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem(this.tokenStorageKey, response.token);
    localStorage.setItem(this.usernameStorageKey, response.username);
    localStorage.setItem(this.rolesStorageKey, JSON.stringify(response.roles || []));
  }
}
