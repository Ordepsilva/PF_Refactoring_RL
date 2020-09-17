import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProjectsService } from 'src/app/services/project/projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../project-dialog/dialog.component';
import { dataService } from 'src/app/services/dataService';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { MendeleyApiService } from 'src/app/services/mendeley/mendeley-api.service';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  isloaded;
  projects = [];
  dataSource;

  displayedColumns: string[] = ['project_name', 'subject', 'createdAt', 'description', 'buttons'];

  constructor(public project_service: ProjectsService,  private router: Router, public dialog: MatDialog, private data_service: dataService) { }

  ngOnInit(): void {
    this.isloaded = false;
    this.getProjectsForUser();
  }

  getProjectsForUser(): void {
    this.project_service.getProjectsForUser().subscribe(
      (result: any) => {
        this.data_service.projects = result;
        this.projects = result;
        this.dataSource = new MatTableDataSource(this.projects);
        this.dataSource.paginator = this.paginator;
        this.isloaded = true;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.isloaded = true;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createproj(): void {
    this.data_service.optionString = "create";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px"
    }).afterClosed().subscribe(result => {
      this.getProjectsForUser();
      if (result.result) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Sucessfully Created",
            type: "success"
          }
        });
      }
    });
  }

  editproj(projectToEdit: any): void {
    this.data_service.optionString = "edit";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px", data: {
        project_name: projectToEdit.project_name,
        subject: projectToEdit.subject,
        description: projectToEdit.description,
        project_id: projectToEdit.project_id,
        date: projectToEdit.date
      }
    }).afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource(this.data_service.projects);
      this.dataSource.paginator = this.paginator;
      if (result.result) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Sucessfully Edited",
            type: "success"
          }
        })
      }
    });
  }

  deleteproject(element: any) {
    this.data_service.optionString = "delete";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px", data: {
        project_name: element.project_name,
        description: element.description,
        project_id: element.project_id,
        subject: element.subject,
        date: element.date
      }
    }).afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource(this.data_service.projects);
      this.dataSource.paginator = this.paginator;
      if (result.result) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Sucessfully Deleted",
            type: "success"
          }
        })
      }
    });
  }

  openProject(row: any) {
    this.router.navigate(["/projectHome/" + row.project_id]);
  }
}
