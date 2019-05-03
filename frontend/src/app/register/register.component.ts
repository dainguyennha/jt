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
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);
  passwordFormControl = new FormControl("", [Validators.required]);
  confirmPasswordFormControl = new FormControl("", [Validators.required]);
  errorStateMatcher = new CustomErrorStateMatcher();

  errorMessage: string = "";
  successMessage: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() { }

  register(value) {
    this.emailFormControl.markAsTouched();
    this.passwordFormControl.markAsTouched();
    this.confirmPasswordFormControl.markAsTouched();

    if (
      !this.emailFormControl.hasError("required") &&
      !this.emailFormControl.hasError("email") &&
      !this.passwordFormControl.hasError("required") && 
      !this.confirmPasswordFormControl.hasError("required")
    ) {
      this.authService.doRegister(value).then(
        res => {
          this.errorMessage = "";
          this.successMessage = "Your account has been created";
          this.router.navigate([AuthService.returnURI]);
        },
        err => {
          this.errorMessage = err.message;
          this.successMessage = "";
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
