import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/services/authentication/authentication-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../MainComponent/info-dialog/info-dialog.component';
@Component({
  selector: 'app-registo',
  templateUrl: './registo.component.html',
  styleUrls: ['./registo.component.css']
})



export class RegistoComponent implements OnInit {
  @Input() user: User = new User(); pass;
  constructor(public validation_service: ValidationService, public useR_service: AuthenticationServiceService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  register(): void {
    if (this.user.username === "") {
      alert("Please insert username.");
    } else if (this.user.password === "" && this.pass === "") {
      alert("Please insert password.");
    } else {

      this.validatepw();
      this.registerService();
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


