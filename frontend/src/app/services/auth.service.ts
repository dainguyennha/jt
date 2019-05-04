import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from "firebase/app";
import { AngularFirestore } from "angularfire2/firestore";

@Injectable()
export class AuthService {
  static authenticated: boolean = false;
  static verified: boolean = false;
  static user: User = null;
  static returnURI: string = "/";
  constructor(
    private http: HttpClient,
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
  ) { }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(
      err.message || "Error: Unable to complete request."
    );
  }

  getUser() {
    return AuthService.user;
  }

  isAuthenticated() {
    return AuthService.authenticated;
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(
        res => {
          this.updateCurrentUser();
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      this.afAuth.auth.signInWithPopup(provider).then(res => {
        this.updateCurrentUser();
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }

  doEmailLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            this.updateCurrentUser();
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          let user = firebase.auth().currentUser;
          user.sendEmailVerification().then(res => {
            resolve(res);
          }, err => reject(err));
          resolve(res);
        }, err => reject(err))
    });
  }

  resolveUser() {
    return new Promise<any>((resolve, reject) => {
      this.getCurrentUser().then(
        res => {
          if (res.providerData[0].providerId == 'password' && res.emailVerified != true) {
            this.router.navigate(['unverified']);
          }

          //  this.db.collection("users").doc(res.uid).ref.get().then(doc => {
          //   let data = doc.data();
          //   let user = new User();
          //   user.id = res.uid;
          //   user.name = res.displayName;
          //   user.email = res.email;
          //   if (data != undefined) {
          //     user.role = data.role;
          //   }
          //   AuthService.authenticated = true;
          //   AuthService.verified = true;
          //   if (res.providerData[0].providerId == 'password' && res.emailVerified != true) {
          //     AuthService.verified = false;
          //   }
          //   AuthService.user = user;
          //   return resolve(true);
          // }, err => {
          //   return resolve(false);
          // });

          let user = new User();
          user.id = res.uid;
          user.name = res.displayName;
          user.email = res.email;
          user.role = 'admin';
          AuthService.authenticated = true;
          AuthService.verified = true;
          if (res.providerData[0].providerId == 'password' && res.emailVerified != true) {
            AuthService.verified = false;
          }
          AuthService.user = user;
          resolve();
        },
        err => {
          AuthService.authenticated = false;
          AuthService.verified = false;
          AuthService.user = new User();
          resolve();
        }
      );
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        this.resolveUser();
        resolve();
      } else {
        reject();
      }
    });
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject("No user logged in");
        }
      });
    });
  }

  updateCurrentUser() {
    return new Promise((resolve: any, reject) => {
      var user = firebase.auth().currentUser;

      this.db.collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        role: "reader"
      });

      user
        .updateProfile({
          displayName: user.displayName,
          photoURL: user.photoURL
        })
        .then(
          res => {
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getTokenHeader() {
    return firebase
      .auth()
      .currentUser.getIdToken()
      .then(token => {
        let httpOptions = {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`
          })
        };
        return httpOptions;
      });
  }
}
