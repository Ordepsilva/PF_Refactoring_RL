import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthenticationServiceService } from './services/authentication/authentication-service.service';
import { JwtInterceptorService } from './helper/JwtInterceptorService';
import { ProjectsService } from './services/project/projects.service';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/MainComponent/project-dialog/dialog.component';
import { SideNavComponent } from './components/MainComponent/side-nav/side-nav.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectsComponent } from './components/MainComponent/projects/projects.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { dataService } from './services/dataService';
import { InfoDialogComponent } from './components/MainComponent/info-dialog/info-dialog.component';
import { ProjectHomeComponent } from './components/MainComponent/project-home/project-home.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ArticleDialogComponent } from './components/MainComponent/article-dialog/article-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ArticleHomeComponent } from './components/MainComponent/article-home/article-home.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MendeleyComponentComponent } from './components/MainComponent/mendeley-component/mendeley-component.component';
import { FilesComponent } from './components/MainComponent/files/files.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DialogComponent,
    SideNavComponent,
    ProjectsComponent,
    InfoDialogComponent,
    ProjectHomeComponent,
    ArticleDialogComponent,
    ArticleHomeComponent,
    MendeleyComponentComponent,
    FilesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    HttpClientModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatMenuModule,
    NgxPaginationModule,
    MatTabsModule,
    MatCheckboxModule,
    MatExpansionModule

  ],
  providers: [AuthenticationServiceService, ProjectsService, dataService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
