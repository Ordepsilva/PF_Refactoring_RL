import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/services/authentication/authentication-service.service';
import { ValidationService } from 'src/app/services/validation.service';
@Component({
  selector: 'app-registo',
  templateUrl: './registo.component.html',
  styleUrls: ['./registo.component.css']
})



export class RegistoComponent implements OnInit {
  @Input() user: User = new User(); pass;
  constructor(public validation_service: ValidationService, public useR_service: AuthenticationServiceService, private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Função responsável por verificar :
   * - se os campos estão preenchidos;
   * - se as passwords coincidem;
   */
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

  //Verifica se as passwords coincidem
  validatepw(): boolean {
    if (this.validation_service.validatePassword(this.user.password, this.pass)) {
      return true;
    }
    return false;
  }

  /**
   * Função responsável por efetuar o pedido a REST API para registar o utilizador
   */
  registerService(): void {
    this.useR_service
      .register(this.user)
      .subscribe(
        result => {
          console.log(result);
          this.router.navigate(["/home"]);
        },
        err => {
          console.log(err.error);
          alert(
            err.error

          );
        }
      );
  }


}


