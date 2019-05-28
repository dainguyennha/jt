import { Component, OnInit, ViewChild, HostBinding } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  FormGroupDirective,
  NgForm,
  Validators
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);
  passwordFormControl = new FormControl("", [Validators.required]);
  errorStateMatcher = new CustomErrorStateMatcher();
  errorMessage: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {}

  loginFB() {
    this.authService.doFacebookLogin().then(res => {
      this.router.navigate([AuthService.returnURI]);
    });
  }

  loginGoogle() {
    this.authService.doGoogleLogin().then(res => {
      this.router.navigate([AuthService.returnURI]);
    });
  }

  loginEmail(value) {
    this.emailFormControl.markAsTouched();
    this.passwordFormControl.markAsTouched();

    if (
      !this.emailFormControl.hasError("required") &&
      !this.emailFormControl.hasError("email") &&
      !this.passwordFormControl.hasError("required")
    ) {
      this.authService.doEmailLogin(value).then(
        res => {
          this.router.navigate([AuthService.returnURI]);
        },
        err => {
          this.errorMessage = err.message;
        }
      );
    }
  }
}

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
