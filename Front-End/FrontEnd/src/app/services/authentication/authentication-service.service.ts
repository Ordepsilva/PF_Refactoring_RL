import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

import { map } from "rxjs/operators";
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';

const endpoint = "http://localhost:3000/auth/";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  constructor(private http: HttpClient, public router: Router) { }

  login(username: string, password: string) {
    return this.http
      .post<any>(endpoint + "login", { username, password })
      .pipe(
        map(token => {
          if (token) {
            localStorage.setItem("token", JSON.stringify(token));
          }
          return token;
        })
      );
  }

  register(user: User) {
    return this.http
      .post<any>(endpoint + "register", user)
      .pipe(
        map(token => {
          if (token) {
            localStorage.setItem("token", JSON.stringify(token));
          }
          return token;
        })
      );
  }

  getuserinfo() {
    return this.http
      .get(endpoint + "getUserInfo")
      .pipe(map(result => {
        if (result) {
          return result;
        }
      }));
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
}
