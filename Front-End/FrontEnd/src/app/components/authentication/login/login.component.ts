import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/services/authentication/authentication-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})






export class LoginComponent implements OnInit {

  @Input() user: User = new User();

  constructor(public service: AuthenticationServiceService, private router: Router) { }

  usernameFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();


  receivedResult = true;

  ngOnInit(): void {

    if (localStorage.getItem('token')) {
      this.router.navigate(['/home']);
    }

  }


  /**
  *  Função  responsável por verificar os campos de entrada, 
  *  caso estejam corretos continua para a validação.
  */

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
  /**
  * Função responsável por validar as credencias do utilizador na REST API
  */
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
          console.log(err.error);
          alert(
            "Sorry we could not found you, please check if username and password are correct."
          );
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

