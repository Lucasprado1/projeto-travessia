import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SecureInnerPageGuard implements CanActivate {
  constructor(private authService: AuthService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Check the user is logged in or not
    //(In case the user is logged in he will have the access to pages that SecureInnerPage Guard have implimented 'Check app.routing.module.ts')
    if(this.authService.isLoggedIn === true) {
      this.router.navigate(['/report']);
    }
     return true;
    }
}