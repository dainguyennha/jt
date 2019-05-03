import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class RedirectService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().then(
        user => {
          if (user.providerData[0].providerId == 'password' && !user.emailVerified) {
            this.router.navigate(["/unverified"]);
          } else {
            this.router.navigate(["/"]);
          }
          return resolve(false);
        },
        err => {
          return resolve(true);
        }
      );
    });
  }
}
