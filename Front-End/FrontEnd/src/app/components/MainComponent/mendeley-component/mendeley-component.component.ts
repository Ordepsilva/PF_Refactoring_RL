import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MendeleyApiService } from 'src/app/services/mendeley/mendeley-api.service';
import { ProjectsService } from 'src/app/services/project/projects.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-mendeley-component',
  templateUrl: './mendeley-component.component.html',
  styleUrls: ['./mendeley-component.component.css']
})
export class MendeleyComponentComponent implements OnInit {
  isAuthenticated: boolean = false;
  isGroups: boolean = false;
  isAllDocuments: boolean = false;
  isSelectedToAdd: boolean = false;
  selectedArticle: boolean = false;
  optionSelected: any;


  userProfile: any;
  myGroups: any = [];
  articles: any = []
  folders: any = [];
  document: any = {};
  allDocuments: any = [];
  groupDocuments: any = [];
  myProjects: any = [];

  projectSelected: any;
  constructor(public apiMendeley: MendeleyApiService, public activatedRoute: ActivatedRoute, public projectService: ProjectsService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.code) {
        this.apiMendeley.token(params.code).subscribe(result => {
          this.isAuthenticated = true;
          this.getMyMendeleyProfile();
        }, (error => {
          console.log(error);
        }))
      } else {
        this.verifyLogin();
      }
    });
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
    }, (error => {
      console.log(error);
    }))
  }

  getAllDocumentsByGroupID(id: any) {
    this.optionSelected = null;
    this.apiMendeley.getAllDocumentsByGroupID(id).subscribe(result => {
      this.groupDocuments = result;
    }, (error => {
      console.log(error);
    }))
  }

  getAllDocuments() {
    this.apiMendeley.getAllDocuments().subscribe(result => {
      this.allDocuments = result;
    }, (error => {
      console.log(error);
    }))
  }

  openGroups(): void {
    this.isGroups = !this.isGroups;
  }

  openAllDocuments(): void {
    this.isAllDocuments = !this.isAllDocuments;
  }

  selectProject() {
    this.isSelectedToAdd = true;
    this.selectedArticle = false;
    this.projectService.getProjectsForUser().subscribe(result => {
      this.myProjects = result;
    }, (error => {
      console.log(error);
    }))
  }

  addArticleToProject() {
    this.apiMendeley.addArticleToProjectID(this.optionSelected[0], this.projectSelected).subscribe(result => {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: result.success,
          type: "success"
        }
      });
      this.isSelectedToAdd=false;
      this.selectedArticle = false;
      this.optionSelected="";
      this.projectSelected="";
    }, (error => {
      console.log(error);
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: error.error.error,
          type: "failed"
        }
      });
    }))

  }
}
