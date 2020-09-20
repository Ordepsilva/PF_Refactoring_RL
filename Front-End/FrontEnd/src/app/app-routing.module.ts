import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthGuardService } from './services/AuthGuard.service';
import { SideNavComponent } from './components/MainComponent/side-nav/side-nav.component';
import { ProjectsComponent } from './components/MainComponent/projects/projects.component';
import { ProjectHomeComponent } from './components/MainComponent/project-home/project-home.component';
import { ArticleHomeComponent } from './components/MainComponent/article-home/article-home.component';
import { MendeleyComponentComponent } from './components/MainComponent/mendeley-component/mendeley-component.component';
import { RegisterComponent } from './components/authentication/register/register.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '', component: SideNavComponent,
    children: [
      { path: 'home', component: ProjectsComponent },
      { path: 'projectHome/:project_id', component: ProjectHomeComponent },
      { path: 'articleHome/:articleID/:project_id', component: ArticleHomeComponent },
      { path: 'mendeley', component: MendeleyComponentComponent }
    ],
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
