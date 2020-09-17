import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ArticleService } from 'src/app/services/article/article.service';
import Cookies from 'js-cookie';
import { dataService } from 'src/app/services/dataService';
import { ArticleDialogComponent } from '../article-dialog/article-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import * as config from 'src/app/configuration/configuration.json';
import * as NeoVis from 'src/app/components/MainComponent/project-home/neovis';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-article-home',
  templateUrl: './article-home.component.html',
  styleUrls: ['./article-home.component.css']
})
export class ArticleHomeComponent implements OnInit {
  title: any;
  isloaded = true;
  //Tabs
  tabAbout: boolean = false;
  tabVisualize: boolean = false;
  tabRelatedArticles: boolean = false;
  //data
  dataSource;
  relatedArticles = [];
  comments = [];
  article: any;
  articleID: any;
  project_id: any;
  displayedColumns: string[] = ['title', 'relationName', 'buttons'];

  constructor(public articleService: ArticleService, public route: ActivatedRoute, public dataService: dataService, public dialog: MatDialog, public router: Router) {

  }

  ngOnInit(): void {
    this.articleID = this.route.snapshot.paramMap.get('articleID');
    this.project_id = this.route.snapshot.paramMap.get('project_id');
    if (this.articleID) {
      this.getArticleInfoById(this.articleID);
      this.getCommentsFromArticleID(this.articleID);
      this.loadRelatedArticles();
    }
  }

  getArticleInfoById(id: number): void {
    this.articleService.getArticleInfoByID(this.articleID).subscribe(result => {
      if (result) {
        this.article = result;
        this.tabAbout = true;
      }
    }, (error => {
      console.log(error);
    }))

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
  }

  setTabVisualize(): void {
    this.loadArticleVizualization();
    this.tabVisualize = true;
    this.tabAbout = false;
    this.tabRelatedArticles = false;
  }

  setTabRelatedArticles(): void {
    this.loadRelatedArticles();
    this.tabRelatedArticles = true;
    this.tabAbout = false;
    this.tabVisualize = false;
  }

  loadRelatedArticles(): void {
    this.articleService.getArticlesRelatedToArticleID(this.articleID).subscribe(result => {
      this.relatedArticles = result;
      if(this.relatedArticles.length > 0){
        document.getElementById("tabVisualization").removeAttribute("disabled");
      }else{
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
        articleID: element.article.articleID,
        relationName: element.relationName
      }
    }).afterClosed().subscribe(result => {
      let newArray = [];
      let j = 0;
      if (result) {
        for (let i = 0; i < this.relatedArticles.length; i++) {
          if (this.relatedArticles[i] != element) {
            newArray[j] = this.relatedArticles[i];
            j++;
          }
        }
        this.dataSource = new MatTableDataSource(newArray);
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
    this.router.navigate(["/articleHome/" + element.articleID]);
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
}
