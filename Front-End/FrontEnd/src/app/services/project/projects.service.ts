import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

import { map } from "rxjs/operators";
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/Project';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};


const endpoint = "http://localhost:3000/project/";

@Injectable({
  providedIn: 'root'
})

export class ProjectsService {

  constructor(private http: HttpClient) { }
 
  createProject(project: Project) {
    return this.http
      .post<any>(endpoint + "create_project", project);
  }

  getProjectsForUser(): Observable<any> {
    return this.http
      .get<any>(endpoint + "getProjectsByUser");
  }

  deleteProject(project_id: string) {
    return this.http.delete<any>(endpoint + project_id);
  }

  editProject(project_id: string, project: any) {
    return this.http
      .put<any>(endpoint + "editProject/" + project_id, project);

  }

}
