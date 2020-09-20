import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../components/MainComponent/info-dialog/info-dialog.component';

@Injectable({
  providedIn: "root"
})
export class ValidationService {
  constructor( public dialog: MatDialog) {}

  /**
   * This function validate a username.
   */
  validateUsername(username: string): boolean {
    if (username === undefined) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: "Username must be filled",
          type: "failed"
        }
      });
      return false;
    } else {
      return true;
    }
  }

  /**
   * This function validate a password.
   */
  validatePassword(password: string, cpassword: string): boolean {
    if (password === undefined) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: "Password must be filled",
          type: "failed"
        }
      });
      return false;
    } else if (password != cpassword) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: "Passwords don't match",
          type: "failed"
        }
      });
      return false;
    } else {
      return true;
    }
  }
}
