import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ArticleService } from 'src/app/services/article/article.service';
import { dataService } from 'src/app/services/dataService';
import { ArticleDialogComponent } from '../article-dialog/article-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import * as config from 'src/app/configuration/configuration.json';
import * as NeoVis from 'src/app/neovis';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver/';


@Component({
  selector: 'app-article-home',
  templateUrl: './article-home.component.html',
  styleUrls: ['./article-home.component.css']
})
export class ArticleHomeComponent implements OnInit {
  title: any;
  isloaded: boolean = true;
  //Tabs
  tabFiles: boolean = false;
  tabAbout: boolean = false;
  tabVisualize: boolean = false;
  tabRelatedArticles: boolean = false;
  //data
  dataSource: any;
  fileSource: any;
  relatedArticles: any[] = [];
  comments: any[] = [];
  files: any[] = [];
  article: any;
  articleID: any;
  project_id: any;
  displayedColumns: string[] = ['title', 'relationName', 'buttons'];
  displayedFiles: string[] = ['name', 'download', 'options'];

  constructor(public articleService: ArticleService, public route: ActivatedRoute, public dataService: dataService, public dialog: MatDialog, public router: Router) {
    route.params.subscribe(val => {
      this.articleID = this.route.snapshot.paramMap.get('articleID');
      if (this.articleID) {
        this.getArticleInfoById();
        this.getCommentsFromArticleID(this.articleID);
        this.loadRelatedArticles();
        this.setTabAbout();
      }
    });
  }

  ngOnInit(): void {
    this.articleID = this.route.snapshot.paramMap.get('articleID');
    this.project_id = this.route.snapshot.paramMap.get('project_id');
    if (this.articleID) {
      this.getArticleInfoById();
      this.getCommentsFromArticleID(this.articleID);
      this.loadRelatedArticles();
    }
  }

  getArticleInfoById(): void {
    this.articleService.getArticleInfoByID(this.articleID).subscribe(result => {
      this.article = result;
      this.tabAbout = true;
    }, (error => {
      console.log(error);
    }));
  }

  getCommentsFromArticleID(id: number): void {
    this.articleService.getCommentsFromArticleID(id).subscribe(result => {
      this.comments = result;
    }, (error => {
      console.log(error);
    }))
  }

  setTabAbout(): void {
    this.tabAbout = true;
    this.tabVisualize = false;
    this.tabRelatedArticles = false;
    this.tabFiles = false;
  }

  setTabVisualize(): void {
    this.loadArticleVizualization();
    this.tabVisualize = true;
    this.tabAbout = false;
    this.tabRelatedArticles = false;
    this.tabFiles = false;
  }

  setTabRelatedArticles(): void {
    this.loadRelatedArticles();
    this.tabRelatedArticles = true;
    this.tabAbout = false;
    this.tabVisualize = false;
    this.tabFiles = false;
  }
  setTabFiles(): void {
    this.tabFiles = true;
    this.tabRelatedArticles = false;
    this.tabAbout = false;
    this.tabVisualize = false;
    this.getFilesFromArticleID();
  }

  loadRelatedArticles(): void {
    this.articleService.getArticlesRelatedToArticleID(this.articleID).subscribe(result => {
      this.relatedArticles = result;
      if (this.relatedArticles.length > 0) {
        document.getElementById("tabVisualization").removeAttribute("disabled");
      } else {
        document.getElementById("tabVisualization").setAttribute("disabled", "disabled");
      }
      this.dataSource = new MatTableDataSource(this.relatedArticles);
    }, (error => {
      console.log(error);
    }));
  }

  deleteRelation(element: any): void {
    this.dataService.optionString = "deleteRelation";
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "400px", data: {
        articleIDTarget: element.article.articleID,
        articleID: this.articleID,
        relationName: element.relationName
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loadRelatedArticles();
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Relation was sucessfully removed",
            type: "success"
          }
        })
      }
    });
  }

  openArticle(element: any): void {
    this.router.navigate(["/articleHome/" + element.article.articleID + "/" + this.project_id]);
  }

  createNewComment(): void {
    this.dataService.optionString = "createComment";
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "400px", data: {
        articleID: this.articleID,
      }
    }).afterClosed().subscribe(result => {
      if (result.comment) {
        this.comments.push(result.comment);
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Comment created",
            type: "success"
          }
        });
      }
    });
  }

  deleteComment(comment: any): void {
    console.log(comment);
    this.dataService.optionString = "deleteCommentary";
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "400px", data: {
        commentID: comment.commentID,
      }
    }).afterClosed().subscribe(result => {
      if (result.result) {
        let newCommentArray = [];
        let j = 0;
        for (let i = 0; i < this.comments.length; i++) {
          if (this.comments[i] != comment) {
            newCommentArray[j] = this.comments[i];
            j++;
          }
        }
        this.comments = newCommentArray;
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Comment deleted",
            type: "success"
          }
        });
      }
    });
  }

  loadArticleVizualization(): void {
    let neoVizConfig;
    this.isloaded = false;
    try {
      this.articleService.getConfigForArticleID(this.articleID, config.neo4j).subscribe((result: any) => {
        this.isloaded = true;
        neoVizConfig = result;
        neoVizConfig.relationships = {
          [NeoVis.NEOVIS_DEFAULT_CONFIG]: {
            "thickness": "count"
          }
        };
        let viz = new NeoVis.default(neoVizConfig);
        viz.render();
      },
        (err: HttpErrorResponse) => {
          console.log(err);
          alert(err);
          this.isloaded = false;
          this.setTabAbout();
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  getFilesFromArticleID(): void {
    this.isloaded = false;
    this.articleService.getFilesForArticleID(this.articleID).subscribe(result => {
      this.files = result;
      this.fileSource = new MatTableDataSource(this.files);
      this.isloaded = true;
    }, (error => {
      if(error.status == "404"){
        this.files = [];
        this.fileSource = new MatTableDataSource(this.files);
      }
      this.isloaded = true;
    }))
  }

  downloadFile(element: string) {
    this.articleService.downloadFile(element).subscribe({
      next(result) {
        let blob: any = new Blob([result], { type: 'application/pdf; charset=utf-8' });
        fileSaver.saveAs(blob, element);
      }, error(msg) {
        let blob: any = new Blob([msg], { type: 'application/pdf; charset=utf-8' });
        fileSaver.saveAs(blob, element);
      }
    });
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: "400px", data: {
        message: "File is downloading...",
        type: "success"
      }
    });
  }

  removeFileFromArticle(filename: string) {
    console.log(filename);
    console.log(this.articleID);
    this.articleService.removeFileFromArticleID(filename, this.articleID).subscribe(result => {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: result.success,
          type: "success"
        }
      });
      this.getFilesFromArticleID();
    }, (error => {
      console.log(error);
    }))
  }
}
