import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { fadeAnimation } from './transitions';

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
    public router: Router
  ) { }

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
