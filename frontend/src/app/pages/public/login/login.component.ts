import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

declare const gapi: any;

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Login to TodoApp</h1>
          <p>Welcome back! Please login to your account.</p>
        </div>
        
        <div *ngIf="error" class="auth-error">
          {{ error }}
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="email"
              required
              email
              #emailInput="ngModel"
              class="form-control auth-email-field"
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
              [(ngModel)]="password"
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
              [disabled]="loginForm.invalid || isLoading"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>
        
        <div class="auth-divider">
          <span>OR</span>
        </div>
        
        <div class="social-login">
          <button id="googleSignIn" class="btn-google" (click)="signInWithGoogle()">
            <i class="fab fa-google"></i>
            Sign in with Google
          </button>
        </div>
        
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  email = "";
  password = "";
  error = "";
  isLoading = false;
  returnUrl = "/dashboard";

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
    
    this.initGoogleSignIn();
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      return;
    }

    this.isLoading = true;
    this.error = "";

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.error = error.message || "Login failed. Please try again.";
        this.isLoading = false;
      },
    });
  }

  initGoogleSignIn(): void {
    console.log("Google Sign-In initialized");
  }

  signInWithGoogle(): void {
    this.isLoading = true;
    this.error = "";}
}

