import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const userData = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    if (userData && accessToken) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  register(user: User): Observable<AuthResponse> {
    const payload = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: user.password
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(this.handleError)
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(this.handleError)
      );
  }

  googleLogin(googleUser: any): Observable<AuthResponse> {
    const id_token = googleUser.getAuthResponse().id_token;
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-login`, { id_token })
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private handleAuthentication(response: AuthResponse): void {
    if (response.success && response.user && response.accessToken) {
      const user: User = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role,
        created_at: response.user.created_at,
        updated_at: response.user.updated_at,
        connect_google_calendar: response.user.connect_google_calendar,
        receive_updates: response.user.receive_updates
      };

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      this.currentUserSubject.next(user);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.status === 409) {
        errorMessage = 'User with this email already exists';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}

