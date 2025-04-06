import { Injectable } from "@angular/core"
import type { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import type { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true
    }

    // Store the attempted URL for redirecting after login
    const returnUrl = state.url
    this.router.navigate(["/login"], { queryParams: { returnUrl } })
    return false
  }
}

