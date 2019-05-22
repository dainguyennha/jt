import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Router, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";
import { fadeAnimation } from './transitions';
import { filter } from 'rxjs/operators';

declare var gtag

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public location: Location,
    public router: Router,
  ) {
    const navEndEvent$ = router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    );
    navEndEvent$.subscribe((e: NavigationEnd) => {
      gtag('config', 'UA-140602899-1', { 'page_path': e.urlAfterRedirects });
    });
  }

  ngOnInit() { }

  signOut() {
    this.authService.doLogout().then(
      res => {
        this.router.navigate(["/"]);
      },
      error => {
        console.log("Logout error", error);
      }
    );
  }
}
