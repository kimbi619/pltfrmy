import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable, of, throwError } from "rxjs"
import type { User, AuthResponse } from "../models/user.model"
import type { Router } from "@angular/router"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private readonly TOKEN_KEY = "auth_token"
  private readonly USER_KEY = "current_user"

  constructor() {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const token = this.getToken()
    const userJson = localStorage.getItem(this.USER_KEY)

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson)
        this.currentUserSubject.next(user)
      } catch (error) {
        console.error("Error parsing user from storage", error)
        this.logout()
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value
  }

  public isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserValue
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  public login(email: string, password: string): Observable<AuthResponse> {
    // In a real app, this would be an API call
    // For demo purposes, we'll simulate a successful login
    if (email === "demo@example.com" && password === "password") {
      const user: User = {
        id: "1",
        firstName: "Demo",
        lastName: "User",
        email: email,
      }

      const response: AuthResponse = {
        user,
        token: "demo_token_" + Math.random().toString(36).substring(2),
      }

      this.setSession(response)
      return of(response)
    }

    return throwError(() => new Error("Invalid email or password"))
  }

  public googleLogin(googleUser: any): Observable<AuthResponse> {
    const profile = googleUser.getBasicProfile()

    const user: User = {
      id: profile.getId(),
      firstName: profile.getGivenName(),
      lastName: profile.getFamilyName(),
      email: profile.getEmail(),
    }

    const response: AuthResponse = {
      user,
      token: googleUser.getAuthResponse().id_token,
    }

    this.setSession(response)
    return of(response)
  }

  public register(user: User): Observable<AuthResponse> {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(2),
    }

    const response: AuthResponse = {
      user: newUser,
      token: "demo_token_" + Math.random().toString(36).substring(2),
    }

    this.setSession(response)
    return of(response)
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    this.currentUserSubject.next(null)
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user))
    this.currentUserSubject.next(authResult.user)
  }
}

