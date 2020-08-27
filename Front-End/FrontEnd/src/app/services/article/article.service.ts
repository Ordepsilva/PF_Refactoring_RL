import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};
const endpoint = "http://localhost:3000/project/articles/";

@Injectable({
  providedIn: 'root'
})

export class ArticleService {

  constructor(private http: HttpClient) { }

  createArticle(article: any, project_id: string) {
    return this.http.post<any>(endpoint + "createArticle/" + project_id, article);
  }

  relateArticlesByID(articleID: any, body: any) {
    return this.http.post<any>(endpoint + " relateArticlesByID/" + articleID, body);
  }

  addCommentToArticleByID(articleID: any, commentary: string) {
    return this.http.post<any>(endpoint + "addCommentToArticleByID/" + articleID, commentary);
  }

  relateOneToMany(articleID: any, body: any) {
    return this.http.post<any>(endpoint + "relateOneToMany/" + articleID, body);
  }

  getArticleInfoByID(articleID: any): Observable<any> {
    return this.http
      .get<any>(endpoint + "getArticleInfoByID/" + articleID);
  }

  getArticlesFromProjectID(project_id: any): Observable<any> {
    return this.http.get<any>(endpoint + "getArticlesFromProjectID/" + project_id);
  }

  getCommentsFromArticleID(articleID: any) {
    return this.http.get<any>(endpoint + "getCommentsFromArticleID/" + articleID);
  }

  deleteArticle(articleID: any) {
    return this.http.delete<any>(endpoint + articleID);
  }

  getConfigForRunNeoVis(project_id: any, body: any) {
    return this.http.post<any>(endpoint + "getConfigForRunNeoVis/" + project_id, body);
  }

  editProject(articleID: any, article: any) {
    return this.http
      .put<any>(endpoint + "editArticle/" + articleID, article);
  }

  getRelationsForProjectID(project_id: any) {
    return this.http.get<any>(endpoint + "getRelationsForProjectID/" + project_id);
  }

  getArticlesRelatedToArticleID(articleID: any) {
    return this.http.get<any>(endpoint + "getArticlesRelatedToArticleID/" + articleID);
  }

  removeRelationBetweenArticles(articleID: any, body: any) {
    return this.http.post<any>(endpoint + "removeRelationBetweenArticles/" + articleID, body);
  }

  deleteComment(commentID: any) {
    return this.http.delete<any>(endpoint + "deleteComment/" + commentID);
  }

  getConfigForArticleID(articleID: any, body: any) {
    return this.http.post<any>(endpoint + "getConfigForArticleID/" + articleID, body);
  }
}

