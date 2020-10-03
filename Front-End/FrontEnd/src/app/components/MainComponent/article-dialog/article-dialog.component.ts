import { Component, OnInit, Inject, Input } from '@angular/core';
import { ArticleService } from 'src/app/services/article/article.service';
import { dataService } from 'src/app/services/dataService';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../project-dialog/dialog.component';
import * as config from 'src/app/configuration/configuration.json';
import Cookies from 'js-cookie';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
export interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-article-dialog',
  templateUrl: './article-dialog.component.html',
  styleUrls: ['./article-dialog.component.css']
})
export class ArticleDialogComponent implements OnInit {
  @Input() articleToCreate: any = {};
  @Input() articleToEdit: any = {};
  @Input() commentary: any;

  selectedOption: string;
  //layout type
  edit = false;
  create = false;
  delete = false;
  deleteRelation = false;
  deleteCommentary = false;
  createComment = false;
  deleteFile = false;
  //data
  project_id: string;
  articleToDelete: any = {};
  articlesReceived: any = [];
  articleEdited: any = {};
  options: Option[] = config.createArticleMenu;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogComponent>, public articleService: ArticleService, public data_service: dataService, public dialog: MatDialog) {
    this.articlesReceived = this.data_service.articles;
    this.articleToDelete = data;
    this.articleToEdit = data.article;
    this.project_id = data.project_id;
  }

  ngOnInit(): void {
    this.verifyTypeOfOperation();
  }

  verifyTypeOfOperation(): void {
    if (this.data_service.optionString == "edit") {
      this.edit = true;
    } else if (this.data_service.optionString == "create") {
      this.create = true;
    } else if (this.data_service.optionString == "delete") {
      this.delete = true;
    } else if (this.data_service.optionString == "deleteRelation") {
      this.deleteRelation = true;
    } else if (this.data_service.optionString == "createComment") {
      this.createComment = true;
    } else if (this.data_service.optionString == "deleteCommentary") {
      this.deleteCommentary = true;
    } else if (this.data_service.optionString == "deleteFile") {
      this.deleteFile = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ nothing: "nothing" });
  }

  deleteArticle(): void {
    this.articleService.deleteArticle(this.articleToDelete.articleID).subscribe(result => {
      let updatedArray = [];
      for (let article of this.articlesReceived) {
        if (article.articleID !== this.articleToDelete.articleID) {
          updatedArray.push(article);
        }
      }
      this.data_service.articles = updatedArray;
      this.dialogRef.close({ result: result });
    }, (error => {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: error.error,
          type: "failed"
        }
      });
    }));
  }

  createArticle(): void {
    this.articleService.createArticle(this.articleToCreate, this.project_id).subscribe(
      result => {
        this.data_service.articles.push(result.article);
        this.dialogRef.close({ result: result });
      }
      , err => {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: err.error,
            type: "failed"
          }
        });
      }
    )
  }

  addFormField(): void {
    if (this.selectedOption == null) {
      alert("You have to choose an option!");
    } else {
      let content = document.getElementById("mat-content");
      let formfieldToAdd = document.getElementById(this.selectedOption);
      content.append(formfieldToAdd);
    }
  }

  removeFormField(id: string): void {
    let content = document.getElementById("mat-content");
    let formfieldToRemove = document.getElementById(id);
    let formfieldOptions = document.getElementById("formFieldOptions");
    content.removeChild(formfieldToRemove);
    formfieldOptions.appendChild(formfieldToRemove);
  }

  editArticle(): void {
    this.articleEdited.title = this.articleToEdit.title;
    this.articleEdited.abstract = this.articleToEdit.abstract;
    this.articleEdited.author = this.articleToEdit.author;
    this.articleEdited.doi = this.articleToEdit.doi;
    this.articleEdited.isbn = this.articleToEdit.isbn;
    this.articleEdited.edition = this.articleToEdit.edition;
    this.articleEdited.citation_key = this.articleToEdit.citation_key;
    this.articleEdited.tags = this.articleToEdit.tags;

    if (this.articleToEdit.year === "") {
    } else {
      this.articleEdited.year = this.articleToEdit.year;
    }

    this.articleService.editProject(this.data.article.articleID, this.articleEdited).subscribe(
      result => {
        for (var i = 0; i < this.data_service.articles.length; i++) {
          if (this.data_service.articles[i].articleID == this.data.article.articleID) {
            this.articleEdited.createdAt = this.data.article.createdAt;
            this.articleEdited.articleID = this.data.article.articleID;
            this.data_service.articles[i] = this.articleEdited;
          }
        }
        this.dialogRef.close({ result: result });
      }, err => {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: err.error,
            type: "failed"
          }
        });
      }
    );
  }

  deleteRelationFromArticle(): void {
    let body: any = {};
    body.articleID = this.data.articleIDTarget;
    body.relationName = this.data.relationName;

    this.articleService.removeRelationBetweenArticles(this.data.articleID, body).subscribe(result => {
      this.dialogRef.close({ result: result.success });
    }, (error => {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: error.error,
          type: "failed"
        }
      });
    }))
  }

  createNewComment(): void {
    let body: any = {};
    body.commentary = this.commentary;

    this.articleService.addCommentToArticleByID(this.data.articleID, body).subscribe(result => {
      this.dialogRef.close({ comment: result.comment });
    }, (error => {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: error.error,
          type: "failed"
        }
      });
    }));
  }

  deleteComment(): void {
    this.articleService.deleteComment(this.data.commentID).subscribe(result => {
      this.dialogRef.close({ result: result });
    }, (error => {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: error.error,
          type: "failed"
        }
      });
    }));
  }

  deleteFileName(): void {
    let body: any = {};
    let filename = this.data.filename;
    console.log(filename);
    body.filename = filename;
    this.articleService.deleteFile(body).subscribe(result => {
      this.dialogRef.close({ result: result });
    }, (error => {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: error.error,
          type: "failed"
        }
      });
    }))
  }
}
