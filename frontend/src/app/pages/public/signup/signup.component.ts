import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { type Router, RouterLink } from "@angular/router"
import type { AuthService } from "../../../services/auth.service"
import type { User } from "../../../models/user.model"

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create an Account</h1>
          <p>Sign up to start managing your tasks efficiently.</p>
        </div>
        
        <div *ngIf="error" class="auth-error">
          {{ error }}
        </div>
        
        <form (ngSubmit)="onSubmit()" #signupForm="ngForm" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                [(ngModel)]="user.firstName"
                required
                #firstNameInput="ngModel"
                class="form-control"
                [class.is-invalid]="firstNameInput.invalid && (firstNameInput.dirty || firstNameInput.touched)"
              />
              <div *ngIf="firstNameInput.invalid && (firstNameInput.dirty || firstNameInput.touched)" class="error-message">
                <div *ngIf="firstNameInput.errors?.['required']">First name is required.</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName"
                [(ngModel)]="user.lastName"
                required
                #lastNameInput="ngModel"
                class="form-control"
                [class.is-invalid]="lastNameInput.invalid && (lastNameInput.dirty || lastNameInput.touched)"
              />
              <div *ngIf="lastNameInput.invalid && (lastNameInput.dirty || lastNameInput.touched)" class="error-message">
                <div *ngIf="lastNameInput.errors?.['required']">Last name is required.</div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="user.email"
              required
              email
              #emailInput="ngModel"
              class="form-control"
              [class.is-invalid]="emailInput.invalid && (emailInput.dirty || emailInput.touched)"
            />
            <div *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)" class="error-message">
              <div *ngIf="emailInput.errors?.['required']">Email is required.</div>
              <div *ngIf="emailInput.errors?.['email']">Please enter a valid email.</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="user.password"
              required
              minlength="6"
              #passwordInput="ngModel"
              class="form-control"
              [class.is-invalid]="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)"
            />
            <div *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)" class="error-message">
              <div *ngIf="passwordInput.errors?.['required']">Password is required.</div>
              <div *ngIf="passwordInput.errors?.['minlength']">Password must be at least 6 characters.</div>
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="signupForm.invalid || isLoading"
            >
              {{ isLoading ? 'Creating account...' : 'Sign Up' }}
            </button>
          </div>
        </form>
        
        <div class="auth-divider">
          <span>OR</span>
        </div>
        
        <div class="social-login">
          <button class="btn-google" (click)="signUpWithGoogle()">
            <i class="fab fa-google"></i>
            Sign up with Google
          </button>
        </div>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Login</a></p>
        </div>
      </div>
    </div>
  `,
})
export class SignupComponent {
  user: User = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  }

  error = ""
  isLoading = false

  constructor(
    // private authService: AuthService,
    // private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password) {
      return
    }

    this.isLoading = true
    this.error = ""

    // this.authService.register(this.user).subscribe({
    //   next: () => {
    //     this.router.navigate(["/"])
    //   },
    //   error: (error) => {
    //     this.error = error.message || "Registration failed. Please try again."
    //     this.isLoading = false
    //   },
    // })
  }

  signUpWithGoogle(): void {
    // In a real application, you would trigger the Google Sign-In flow
    // For demo purposes, we'll simulate a successful Google signup
    this.isLoading = true

    // Simulate Google user object
    const mockGoogleUser = {
      getBasicProfile: () => ({
        getId: () => "google_123456789",
        getGivenName: () => "Google",
        getFamilyName: () => "User",
        getEmail: () => "google.user@example.com",
      }),
      getAuthResponse: () => ({
        id_token: "mock_google_token_" + Math.random().toString(36).substring(2),
      }),
    }

    setTimeout(() => {
      // this.authService.googleLogin(mockGoogleUser).subscribe({
      //   next: () => {
      //     this.router.navigate(["/"])
      //   },
      //   error: (error) => {
      //     this.error = error.message || "Google signup failed. Please try again."
      //     this.isLoading = false
      //   },
      // })
    }, 1000) // Simulate network delay
  }
}

