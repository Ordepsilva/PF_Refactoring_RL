import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/services/authentication/authentication-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../MainComponent/info-dialog/info-dialog.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})



export class RegisterComponent implements OnInit {
  @Input() user: User = new User(); pass;
  constructor(public validation_service: ValidationService, public useR_service: AuthenticationServiceService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  register(): void {
    if (this.user.username === "") {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: "Please insert username",
          type: "failed"
        }
      });
    } else if (this.user.password === "" && this.pass === "") {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: "Please insert password",
          type: "failed"
        }
      });
    } else {
      let validated = this.validatepw();
      if (validated) {
        this.registerService();
      }
    }
  }

  validatepw(): boolean {
    if (this.validation_service.validatePassword(this.user.password, this.pass)) {
      return true;
    }
    return false;
  }

  registerService(): void {
    this.useR_service
      .register(this.user)
      .subscribe(
        result => {
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            width: "400px", data: {
              message: "You are now registed!",
              type: "success"
            }
          });
          this.router.navigate(["/home"]);
        },
        err => {
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


