import { Component, OnInit, ViewChild, HostBinding } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-unverified",
  templateUrl: "./unverified.component.html",
  styleUrls: ["./unverified.component.css"]
})
export class UnverifiedComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() { }
}