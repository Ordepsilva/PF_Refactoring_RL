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
  /**
   * Esta função faz um pedido http à restApi para efetuar a criação de um projeto
   * @param user Este é o user que será criado na base de dados
   */
  createProject(project: Project) {
    return this.http
      .post<any>(endpoint + "create_project", project);
  }

  /**
   * Esta função faz um pedido http à restApi para receber os Projetos do utilizador
   */
  getProjectsForUser(): Observable<any> {
    return this.http
      .get<any>(endpoint + "getProjectsByUser");
  }

  /**
   * Esta função faz um pedido http à restApi para eliminar o projeto selecionado
   * @param projectid id do projeto a ser eliminado
   */
  deleteProject(project_id: string) {
    return this.http.delete<any>(endpoint + project_id);
  }

  /**
   * Esta função é responsável por fazer um pedido http à restApi para actualizar as informações de um projeto.
   * @param project_id id do projeto a ser alterado
   * @param project novas informações a ser alteradas
   */
  editProject(project_id: string, project: any) {
    return this.http
      .put<any>(endpoint + "editProject/" + project_id, project);

  }

}
