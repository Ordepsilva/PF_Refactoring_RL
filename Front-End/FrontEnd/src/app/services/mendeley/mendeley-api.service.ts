import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const APIURL = "http://localhost:3000/mendeley/";
const MENDELEYAPI = "https://api.mendeley.com/";


@Injectable({
  providedIn: 'root'
})

export class MendeleyApiService {

  constructor(private http: HttpClient) {

  }

  login(): Observable<any> {
    return this.http.get<any>(APIURL + "login").pipe(
      map(result => {
        window.location.href = result.redirect;
      })
    );
  }

  token(code: any): Observable<any> {
    return this.http
      .post<any>(APIURL + "token", { code: code })
      .pipe(
        map(token => {
          if (token) {
            localStorage.setItem("mendeleyToken", JSON.stringify(token.mendeleyToken));
          }
          return token;
        })
      );
  }

  getMyMendeleyProfile(): Observable<any> {
    let options = this.mendeleyOptions();
    return this.http.get<any>(MENDELEYAPI + "profiles/me", options);
  }

  getMyGroups(): Observable<any> {
    let options = this.mendeleyOptions();
    return this.http.get<any>(MENDELEYAPI + "groups", options);
  }

  getGroupByID(id: any): Observable<any> {
    let options = this.mendeleyOptions();
    return this.http.get<any>(MENDELEYAPI + "groups/" + id, options);
  }

  getFilesFromFolderID(id: any): Observable<any> {
    let options = this.mendeleyOptions();
    return this.http.get<any>(MENDELEYAPI + "files?group_id=" + id, options);
  }

  getDocumentsFromFolderID(id: any): Observable<any> {
    let options = this.mendeleyOptions();
    return this.http.get<any>(MENDELEYAPI + "folders/" + id + "/documents", options);
  }

  getFoldersFromGroupID(id: any): Observable<any> {
    let options = this.mendeleyOptions();
    return this.http.get<any>(MENDELEYAPI + "folders?group_id=" + id, options);
  }

  getDocumentById(id: any): Observable<any> {
    let options = this.mendeleyOptions();
    return this.http.get<any>(MENDELEYAPI + "documents/" + id + "?view=all", options);
  }

  getAllDocumentsByGroupID(id: any): Observable<any> {
    let options = this.mendeleyOptions();
    return this.http.get<any>(MENDELEYAPI + "documents?group_id=" + id + "&view=all", options);
  }
  getAllDocuments(): Observable<any> {
    let options = this.mendeleyOptions();
    return this.http.get<any>(MENDELEYAPI + "documents?view=all", options);
  }

  addArticleToProjectID(body: any, projectID: any): Observable<any> {
    return this.http.post<any>(APIURL + "addArticleToProjectID/" + projectID, body);
  }

  getNotesForDocumentID(documentID:any): Observable<any>{
    let options = this.mendeleyOptions();
    return this.http.get<any[]>(MENDELEYAPI + "annotations?document_id=" + documentID + "&limit=200", options);
  }
  
  mendeleyOptions(): any {
    let token = localStorage.getItem('mendeleyToken');
    if (token) {
      return {
        headers: { 'Authorization': 'Bearer ' + token },
        json: true
      };
    }
  }

  isAuthenticatedInMendeley(): boolean {
    let token = localStorage.getItem('mendeleyToken');
    if (token) {
      return true;
    } else {
      return false;
    }
  }

}
