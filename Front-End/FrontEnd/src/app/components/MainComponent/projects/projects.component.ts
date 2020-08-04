import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProjectsService } from 'src/app/services/project/projects.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { dataService } from 'src/app/services/dataService';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import Cookies from 'js-cookie';
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

  constructor(public project_service: ProjectsService, private router: Router, public dialog: MatDialog, private projectC: dataService) { }

  ngOnInit(): void {
    Cookies.remove('project_id');
    Cookies.remove('project_name');
    this.isloaded = false;
    this.project_service.getProjectsForUser().subscribe(
      (result: any) => {
        this.projectC.projects = result;
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

  /**
   * Aplica o filtro da search bar sobre a tabela
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Função responsável por abrir o popup de criar projeto e actualizar a tabela
   */
  createproj(): void {
    this.projectC.optionString = "create";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px"
    }).afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource(this.projectC.projects);
      this.dataSource.paginator = this.paginator;
      if (result.result) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Sucessfully Created",
            type:"success"
          }
        })
      }
    });
  }

  /**
   * Função responsável por abrir o popup de editar o projeto e actualizar a tabela
   * @param projectToEdit projeto que vai ser editado
   */
  editproj(projectToEdit: any): void {
    this.projectC.optionString = "edit";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px", data: {
        project_name: projectToEdit.project_name,
        subject: projectToEdit.subject,
        description: projectToEdit.description,
        project_id: projectToEdit.project_id,
        date: projectToEdit.date
      }
    }).afterClosed().subscribe(result => {

      this.dataSource = new MatTableDataSource(this.projectC.projects);
      this.dataSource.paginator = this.paginator;

      if (result.result) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px",  data: {
            message: "Sucessfully Edited",
            type:"success"
          }
        })
      }
    })
      ;
  }

  /**
   * Função responsável por abrir o popup de  eliminar um projeto e actualizar a tabela de projetos
   * @param element projeto a ser eliminado
   */
  deleteproject(element: any) {
    this.projectC.optionString = "delete";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px", data: {
        project_name: element.project_name,
        description: element.description,
        project_id: element.project_id,
        subject: element.subject,
        date: element.date
      }
    }).afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource(this.projectC.projects);
      this.dataSource.paginator = this.paginator;
      if (result.result) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Sucessfully Deleted",
            type:"success"
          }
        })
      }
    });
  }

  ver(row:any){
    console.log(row);
    Cookies.set('project_id', row.project_id);
    Cookies.set('project_name', row.project_name);
   
    this.router.navigate(["/projectHome"]);
  }
}
