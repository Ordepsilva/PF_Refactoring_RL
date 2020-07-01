import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/project/projects.service';
import { Project } from 'src/app/models/Project';
import { dataService } from 'src/app/services/dataService';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {
  //Inputs recebidos
  @Input() project: Project = new Project();
  @Input() projectEdit: Project = new Project();

  //Variáveis que definem o tipo de operação
  edit = false;
  create = false;
  delete = false;

  //Objetos vazios
  projectToedit: any = {};
  projectTodelete: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>, public dialog: MatDialog, public router: Router, public proj_service: ProjectsService, private projectTo: dataService
  ) {
    this.projectEdit = data;
    this.projectTodelete = data;
  }

  ngOnInit(): void {
    if (this.projectTo.optionString == "edit") {
      this.edit = true;
    } else if (this.projectTo.optionString == "create") {
      this.create = true;
    } else if (this.projectTo.optionString == "delete") {
      this.delete = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ nothing: "nothing" });
  }
  /**
   * Verifica os campos do projeto, se estão ou não completos
   */
  verifyProj(): void {
    if (this.project.project_name === "") {
      alert("Please insert a project name!");
    } else if (this.project.subject === "") {
      alert("Please insert a subject");
    } else if (this.projectTo.optionString == "create") {
      this.createProj();
    } else if (this.projectTo.optionString == "edit") {
      this.editProject();
    }
  }

  /**
   * Função responsável por criar um projeto
   */
  createProj(): void {
    this.proj_service.createProject(this.project).subscribe(
      result => {
        this.projectTo.projects.push(result.obj);
        this.dialogRef.close({result:result});
      }
      , err => {
        console.log(err.error);
        alert(
          err.error
        );
      }
    )
  };

  /**
   * Função responsável por editar um projeto
   */
  editProject(): void {
    this.projectToedit.project_name = this.projectEdit.project_name;
    this.projectToedit.subject = this.projectEdit.subject;

    if (this.projectEdit.description === "") {
    } else {
      this.projectToedit.description = this.projectEdit.description;
    }

    this.proj_service.editProject(this.data.project_id, this.projectToedit).subscribe(
      result => {
        for (var i = 0; i < this.projectTo.projects.length; i++) {
          if (this.projectTo.projects[i].project_id == this.data.project_id) {
            this.projectToedit.date = this.data.date;
            this.projectToedit.project_id = this.data.project_id;
            this.projectTo.projects[i] = this.projectToedit;
          }
        }
        this.dialogRef.close({ result: result });

      }, err => {
        console.log(err.error);
        alert(err.error);
      }
    );
  }

  /**
   * Função responsável por eliminar um projeto
   */
  deleteProj(): void {
    try {
      this.proj_service.deleteProject(this.projectTodelete.project_id).subscribe(result => {
        let updatedArray = [];
        for (let project of this.projectTo.projects) {
          if (project.project_id !== this.projectTodelete.project_id) {

            updatedArray.push(project);
          }
        }
        this.projectTo.projects = updatedArray;
        this.dialogRef.close({ result: result });
      }), err => {
        console.log(err.error);
      };
    } catch (err) {
      console.log(err);
    }

  }
}

