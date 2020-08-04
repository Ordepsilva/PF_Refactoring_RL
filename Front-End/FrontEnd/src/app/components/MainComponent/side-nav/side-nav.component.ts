import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { AuthenticationServiceService } from 'src/app/services/authentication/authentication-service.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  user = new User();
  username: string;
  constructor(public authservice: AuthenticationServiceService, private router: Router) { }

  ngOnInit(): void {
      this.authservice.getuserinfo().subscribe(
        (result: any) => {
          this.user = result;
          console.log(result);
          this.username = this.user.username;
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      )
    
  }

  /**Função responsável por efetuar o logout*/
  logout() {
    try {
      localStorage.removeItem('token');
      this.router.navigate(["/login"]);
    } catch (err) {
      console.log(err);
    }
  }
}
