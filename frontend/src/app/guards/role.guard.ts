import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.authService.resolveUser().then(
        () => {
          alert(AuthService.user.role);
          if (AuthService.user.role == 'admin') {
            return resolve(true);
          } else {
            return reject("Restricted page");
          }
        },
        err => {
          AuthService.returnURI = state.url;
          this.router.navigate(["/login"]);
          return resolve(false);
        }
      );
    });
  }
}


