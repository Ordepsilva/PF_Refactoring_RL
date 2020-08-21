import { Component, OnInit, ViewChild } from '@angular/core';
import * as NeoVis from 'src/app/components/MainComponent/project-home/neovis';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Cookies from 'js-cookie'
import { ArticleService } from 'src/app/services/article/article.service';
import { HttpErrorResponse } from '@angular/common/http';
import { dataService } from 'src/app/services/dataService';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../project-dialog/dialog.component';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { ArticleDialogComponent } from '../article-dialog/article-dialog.component';
import * as config from 'src/app/configuration/configuration.json';

@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.css']
})
export class ProjectHomeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //
  project_name;
  project_id;
  isloaded = false;
  //tabs
  firstLabel = false;
  secondLabel = false;
  relateLabel = false;
  //DATA
  dataSource;
  articles = [];
  //Config
  displayedColumns: string[] = ['title', 'year', 'createdAt', 'buttons'];
  pageSizeOptions: any = config.pageOptions;

  constructor(public router: Router, public articleService: ArticleService, private data_service: dataService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.project_name = Cookies.get('project_name');
    this.project_id = Cookies.get('project_id');
    this.firstLabel = true;
    this.secondLabel = false;
    this.articleService.getArticlesFromProjectID(Cookies.get('project_id')).subscribe(
      (result: any) => {
        this.articles = result;
        console.log(result);
        this.dataSource = new MatTableDataSource(this.articles);
        this.data_service.articles = this.articles;
        this.dataSource.paginator = this.paginator;
        this.isloaded = true;
        if (this.articles.length == 0) {
          document.getElementById("vizualize").setAttribute("disabled", "disabled");
        }
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

  project_info(): void {
    this.data_service.optionString = "info";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "700px", data: {
        project_id: this.project_id,
      }
    });
  }

  loadNeoVizualization() {
    let neoVizConfig;
    this.isloaded = false;
    try {
      this.articleService.getConfigForRunNeoVis(this.project_id, config.neo4j).subscribe((result: any) => {
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
          this.setLabel1();
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  setLabel1() {
    this.firstLabel = true;
    this.secondLabel = false;
    this.isloaded = true;
    document.getElementById("paginator").style.display = "block";
  }

  setLabel2() {
    this.loadNeoVizualization();
    this.firstLabel = false;
    this.secondLabel = true;

    document.getElementById("paginator").style.display = "none";
  }

  deleteArticle(element: any) {
    this.data_service.optionString = "delete";
    console.log(element.title);
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "400px", data: {
        articleID: element.articleID,
        title: element.title,
      }
    }).afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource(this.data_service.articles);
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

  editArticle(element: any) {
    console.log(element);
    this.data_service.optionString = "edit";
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "500px", data: {
        article: element,
      }
    }).afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource(this.data_service.articles);
      this.dataSource.paginator = this.paginator;
      if (result.result) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Sucessfully Edited",
            type: "success"
          }
        });
      }
      if (result.error) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: result.error,
            type: "failed"
          }
        });
      }
    });
  }

  openProject(row: any) {
    this.router.navigate(["/projectHome"]);
  }

  createArticle() {
    this.data_service.optionString = "create";
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "500px", data: {
        project_id: this.project_id,

      }
    }).afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource(this.data_service.articles);
      this.dataSource.paginator = this.paginator;
      if (result.result) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: "Sucessfully Created",
            type: "success"
          }
        });
      }
      if (result.error) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: result.error,
            type: "failed"
          }
        });
      }
    });
  }

}

