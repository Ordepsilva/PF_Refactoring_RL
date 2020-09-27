import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/services/article/article.service';
import { MendeleyApiService } from 'src/app/services/mendeley/mendeley-api.service';
import { ProjectsService } from 'src/app/services/project/projects.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-mendeley-component',
  templateUrl: './mendeley-component.component.html',
  styleUrls: ['./mendeley-component.component.css']
})
export class MendeleyComponentComponent implements OnInit {
  displayedArticleColumns: string[] = ['select', 'title', 'authors'];
  displayProjects: string[] = ['select', 'title'];
  displayedGroups: string[] = ['title'];
  selectedProject = new SelectionModel<any>(false);
  selectedDocument = new SelectionModel<any>(false);
  isAuthenticated: boolean = false;
  itsDocuments: boolean = false;
  itsGroups: boolean = false;
  itsProjects: boolean = false;
  documentSource: any;
  groupSource: any;
  projectSource: any;
  userProfile: any;
  myGroups: any = [];
  allDocuments: any = [];
  groupDocuments: any = [];
  myProjects: any = [];

  projectSelected: any;
  constructor(public apiMendeley: MendeleyApiService, public activatedRoute: ActivatedRoute, public projectService: ProjectsService, public dialog: MatDialog, public articleService: ArticleService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.code) {
        this.apiMendeley.token(params.code).subscribe(result => {
          this.isAuthenticated = true;
          this.getMyMendeleyProfile();
          this.getMyProjects();
          this.getAllDocuments();
        }, (error => {
          console.log(error);
        }))
      } else {
        this.verifyLogin();
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectedDocument.selected.length;
    const numRows = this.documentSource.length;
    return numSelected === numRows;
  }

  isAllSelectedProject() {
    const numSelected = this.selectedProject.selected.length;
    const numRows = this.projectSource.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selectedDocument.clear() :
      this.documentSource.data.forEach(row => this.selectedDocument.select(row));
  }

  masterToggleProject(): void {
    this.isAllSelectedProject() ?
      this.selectedProject.clear() :
      this.documentSource.data.forEach(row => this.selectedProject.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectedDocument.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  checkboxLabelProject(row?: any): string {
    if (!row) {
      return `${this.isAllSelectedProject() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectedProject.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  setDocuments(): void {
    this.itsGroups = false;
    this.getAllDocuments();
  }

  setGroups(): void {
    this.getMyGroups();
    this.itsDocuments = false;
  }

  verifyLogin(): void {
    if (!this.apiMendeley.isAuthenticatedInMendeley()) {
      this.apiMendeley.login().subscribe(result => {
        console.log(result);
      }, (error => {
        console.log(error);
      }))
    } else {
      this.getMyMendeleyProfile();
      this.getMyProjects();
      this.getAllDocuments();
      console.log("you are authenticated");
    }
  }

  getMyMendeleyProfile(): void {
    this.apiMendeley.getMyMendeleyProfile().subscribe(result => {
      this.userProfile = result;
      this.isAuthenticated = true;
    }, (error => {
      if (error.statusText = "Unauthorized") {
        this.apiMendeley.login().subscribe(result => {
          console.log(result);
        })
      }
    }))
  }

  getMyGroups(): void {
    this.apiMendeley.getMyGroups().subscribe(result => {
      this.myGroups = result;
      this.groupSource = new MatTableDataSource(this.myGroups);
      this.itsGroups = true;
    }, (error => {
      console.log(error);
    }))
  }

  getAllDocumentsByGroupID(id: any) {
    this.apiMendeley.getAllDocumentsByGroupID(id).subscribe(result => {
      console.log(result);

      let articles = [];
      result.forEach(element => {
        let article = element;
        let authors = element.authors;
        article.author = "";
        if (authors !== "" && authors !== undefined) {
          authors.forEach(element => {
            article.author += element.first_name + " " + element.last_name + ";";
          });
        }
        articles.push(article);
      });

      this.groupDocuments = articles;
      console.log(this.groupDocuments);
      this.documentSource = new MatTableDataSource(this.groupDocuments);
      this.itsDocuments = true;
      this.itsGroups = false;
    }, (error => {
      console.log(error);
    }));
  }

  getAllDocuments() {
    this.apiMendeley.getAllDocuments().subscribe(result => {
      let articles = [];
      result.forEach(element => {
        let article = element;
        let authors = element.authors;
        article.author = "";
        if (authors !== "" && authors !== undefined) {
          authors.forEach(element => {
            article.author += element.first_name + " " + element.last_name + ";";
          });
        }
        articles.push(article);
      });

      this.allDocuments = articles;
      this.documentSource = new MatTableDataSource(this.allDocuments);
      this.itsDocuments = true;
    }, (error => {
      console.log(error);
    }))
  }

  getMyProjects(): void {
    this.projectService.getProjectsForUser().subscribe(result => {
      this.myProjects = result;
      this.projectSource = new MatTableDataSource(this.myProjects);
      this.itsProjects = true;
    }, (error => {
      console.log(error);
    }))
  }

  addArticleToProject(): void {
    if (this.selectedDocument.selected[0] && this.selectedProject.selected[0]) {
      this.apiMendeley.addArticleToProjectID(this.selectedDocument.selected[0], this.selectedProject.selected[0].project_id).subscribe(result => {
        let articleID = result.article.articleID;

        this.apiMendeley.getNotesForDocumentID(this.selectedDocument.selected[0].id).subscribe(result => {
          let notes = [];

          result.forEach(element => {
            if (element.type == "sticky_note" || element.type == "note") {
              notes.push(element);
            }
          });

          notes.forEach(element => {
            let body: any = {};
            body.commentary = element.text;
            this.articleService.addCommentToArticleByID(articleID, body).subscribe(result => {
            }, (error => {
              console.log(error);
            }))
          });

          const dialogRef = this.dialog.open(InfoDialogComponent, {
            width: "400px", data: {
              message: "Successfully added to the project",
              type: "success"
            }
          });
        }, (error => {
          console.log(error);
        }))
      }, (error => {
        console.log(error);
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: error.error.error,
            type: "failed"
          }
        });
      }))
    } else if (!this.selectedDocument.selected[0]) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: "You need to select one document",
          type: "failed"
        }
      });
    } else if (!this.selectedProject.selected[0]) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: "You need to select one project",
          type: "failed"
        }
      });
    }
  }
}
