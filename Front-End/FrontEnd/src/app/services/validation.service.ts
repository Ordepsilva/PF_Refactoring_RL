import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ValidationService {
  constructor() {}

  /**
   * This function validate a username.
   */
  validateUsername(username: string): boolean {
    if (username === undefined) {
      alert("Username must be filled.");
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
      alert("Password must be filled.");
      return false;
    } else if (password != cpassword) {
      alert("Passwords don´t match.");
      return false;
    } else {
      return true;
    }
  }
}
