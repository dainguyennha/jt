import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { AngularFirestore } from "angularfire2/firestore";

@Injectable()
export class UserResolver implements Resolve<Boolean> {
  user: User;
  constructor(private authService: AuthService, private router: Router, private db: AngularFirestore) { }

  resolve(route: ActivatedRouteSnapshot): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().then(
        res => {
          this.db.collection("users").doc(res.uid).ref.get().then(doc => {
            let data = doc.data();
            let user = new User();
            user.id = res.uid;
            user.name = res.displayName;
            user.email = res.email;
            if (data != undefined) {
              user.role = data.role;
            }
            AuthService.authenticated = true;
            AuthService.verified = true;
            if (res.providerData[0].providerId == 'password' && res.emailVerified != true) {
              AuthService.verified = false;
            }
            AuthService.user = user;
            return resolve(true);
          }, err => {
            return resolve(false);
          });
        },
        err => {
          AuthService.authenticated = false;
          AuthService.verified = false;
          AuthService.user = new User();
          return resolve(false);
        }
      );
    });
  }
}
