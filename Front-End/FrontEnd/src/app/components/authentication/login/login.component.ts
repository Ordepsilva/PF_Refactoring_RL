import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/services/authentication/authentication-service.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../MainComponent/info-dialog/info-dialog.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @Input() user: User = new User();
  usernameFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  receivedResult = true;

  constructor(public service: AuthenticationServiceService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/home']);
    }
  }

  login(): void {
    this.receivedResult = false;
    if (this.user.username === "") {
      this.receivedResult = true;
      alert("Please insert username.");
    } else if (this.user.password === "") {
      this.receivedResult = true;
      alert("Please insert password.");
    } else {
      this.serviceLogin();
    }
  }

  serviceLogin(): void {
    this.service
      .login(this.user.username, this.user.password)
      .subscribe(
        result => {
          this.receivedResult = true;
          console.log(result);
          this.router.navigate(["/home"]);
        },
        err => {
          this.receivedResult = true;
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            width: "400px", data: {
              message: err.error,
              type: "failed"
            }
          });
        }
      );
  }


}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

