import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegistoComponent } from './components/authentication/registo/registo.component';
import { AuthGuardService } from './services/AuthGuard.service';
import { SideNavComponent } from './components/MainComponent/side-nav/side-nav.component';
import { ProjectsComponent } from './components/MainComponent/projects/projects.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistoComponent },
  {
    path: 'home', component: SideNavComponent,
    children: [{ path: '', component: ProjectsComponent }], canActivate: [AuthGuardService]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
