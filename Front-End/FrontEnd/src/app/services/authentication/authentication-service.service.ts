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
  /**
   * Esta função faz um pedido http à restApi para efetuar o login
   * @param username Uma string com o username do utilizador
   * @param password Uma string com a password do utilizador
   */
  login(username: string, password: string) {
    return this.http
      .post<any>(endpoint + "login", { username, password })
      .pipe(
        map(token => {
          //Se houver um token na resposta significa que o login foi efetuado com sucesso
          if (token) {
            // Guarda as informações do user e o jwt token no local storage 
            localStorage.setItem("token", JSON.stringify(token));
          }
          return token;
        })
      );
  }

  /**
   * Esta função faz um pedido http à restApi para efetuar o registo de uma conta
   * @param user Este é o user que será criado na base de dados
   */
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

  /**
   * Esta função faz um pedido http à restApi para receber as informações do user
   */
  getuserinfo() {
    return this.http
      .get(endpoint + "getUserInfo")
      .pipe(map(result => {
        if (result) {
          return result;
        } else {
          console.log("Error");
        }
      }));
  }

  /**
   * Esta função efetua o logout
   */
  logout() {
    //remove do localstore o token armazenado
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
}
