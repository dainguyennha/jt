import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class VerifiedService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().then(
        user => {
          if (user.providerData[0].providerId == 'password' && !user.emailVerified) {
            return resolve(true);
          } else {
            this.router.navigate(["/"]);
            return resolve(false);
          }
        },
        err => {
          this.router.navigate(["/login"]);
          return resolve(false);
        }
      );
    });
  }
}
