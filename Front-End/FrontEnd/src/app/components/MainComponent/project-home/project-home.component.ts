import { Component, OnInit, ViewChild } from '@angular/core';
import * as NeoVis from 'src/app/components/MainComponent/project-home/neovis';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import Cookies from 'js-cookie';
import { ArticleService } from 'src/app/services/article/article.service';
import { HttpErrorResponse } from '@angular/common/http';
import { dataService } from 'src/app/services/dataService';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../project-dialog/dialog.component';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { ArticleDialogComponent } from '../article-dialog/article-dialog.component';
import * as config from 'src/app/configuration/configuration.json';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectsService } from 'src/app/services/project/projects.service';
export interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.css']
})
export class ProjectHomeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  project_name;
  project_id;
  relationOption: string;
  inputRelationName: string;
  isloaded = false;
  //tabs
  firstTab = false;
  secondTab = false;
  thirdTab = false;
  //DATA
  dataSource;
  articleSource;
  articles = [];
  relations: Option[] = [];
  //Config
  displayedColumns: string[] = ['title', 'year', 'createdAt', 'buttons'];
  displayedArticleColumns: string[] = ['select', 'title']
  selection = new SelectionModel<any>(true, []);
  selectedArticle = new SelectionModel<any>(false);

  pageSizeOptions: any = config.pageOptions;

  constructor(public router: Router, public projectService: ProjectsService, public articleService: ArticleService, private data_service: dataService, public dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.project_id = this.route.snapshot.paramMap.get('project_id');
    console.log(this.project_id);
    this.isloaded = false;
    if (this.project_id) {
      this.getProjectInfoById(this.project_id);
      this.getMyArticles(this.project_id);
      this.firstTab = true;
    } else {
      this.router.navigate(['/home']);
    }
  }

  getMyArticles(project_id: number) {
    this.articleService.getArticlesFromProjectID(project_id).subscribe(
      (result) => {
        console.log(result);
        this.articles = result;
        this.dataSource = new MatTableDataSource(this.articles);
        this.data_service.articles = this.articles;
        this.dataSource.paginator = this.paginator;
        this.isloaded = true;
        console.log(this.articles.length == 0);
        if (this.articles.length == 0) {
          document.getElementById("vizualize").setAttribute("disabled", "disabled");
        } else {
          document.getElementById("vizualize").removeAttribute("disabled");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.isloaded = true;
      }
    );
  }

  getProjectInfoById(project_id: any) {
    this.projectService.getProjectInfo(project_id).subscribe(result => {
      this.project_name = result.project_name;
      console.log(result);
    }, (error => {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: error.error,
          type: "failed"
        }
      });
    }))
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  project_info(): void {
    this.data_service.optionString = "info";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "700px", data: {
        project_id: this.project_id,
      }
    });
  }

  loadNeoVizualization(): void {
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
          this.setTab1();
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  setTab1(): void {
    this.firstTab = true;
    this.secondTab = false;
    this.thirdTab = false;
    this.isloaded = true;
    document.getElementById("paginator").style.display = "block";
  }

  setTab2(): void {
    this.firstTab = false;
    this.secondTab = true;
    this.thirdTab = false;
    this.loadTablesToRelateArticles();
    document.getElementById("paginator").style.display = "none";
  }

  setTab3(): void {
    this.loadNeoVizualization();
    this.firstTab = false;
    this.secondTab = false;
    this.thirdTab = true;
    document.getElementById("paginator").style.display = "none";
  }

  deleteArticle(element: any): void {
    this.data_service.optionString = "delete";
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "400px", data: {
        articleID: element.articleID,
        title: element.title,
      }
    }).afterClosed().subscribe(result => {
      this.getMyArticles(this.project_id);
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

  editArticle(element: any): void {
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

  openArticle(row: any): void {
    this.router.navigate(["/articleHome/" + row.articleID , this.project_id]);
  }

  createArticle(): void {
    this.data_service.optionString = "create";
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "500px", data: {
        project_id: this.project_id,

      }
    }).afterClosed().subscribe(result => {
      this.getMyArticles(this.project_id);
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

  loadTablesToRelateArticles(): void {
    this.relations = [];
    this.articleSource = new MatTableDataSource(this.articles);
    try {
      this.articleService.getRelationsForProjectID(this.project_id).subscribe(result => {
        if (result) {
          for (let i = 0; i < result.length; i++) {
            this.relations.push({ value: result[i], viewValue: result[i] })
          }
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  newRelationName(): void {
    document.getElementById("inputRelation").style.display = "block";
    document.getElementById('dropdownRelationName').style.display = "none";
  }

  closeRelationInput(inputName: string): void {
    if (inputName == undefined) {
      alert("You need to write the relation name");
    } else {
      let relationName = {
        value: inputName, viewValue: inputName
      };
      this.relations.push(relationName);
    }
    document.getElementById("inputRelation").style.display = "none";
    document.getElementById('dropdownRelationName').style.display = "block";
  }

  relateArticles(): void {
    let articlesIDToRelate: any = [{}];
    let articleID: any;
    let body: any = {};

    for (let i = 0; i < this.selection.selected.length; i++) {
      articlesIDToRelate[i] = { articleID: this.selection.selected[i].articleID };
    }
    articleID = this.selectedArticle.selected[0].articleID;

    body.articles = articlesIDToRelate;
    body.articleID = articleID;
    body.relationName = this.relationOption;

    try {
      this.articleService.relateOneToMany(this.project_id, body).subscribe(result => {
        if (result) {
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            width: "400px", data: {
              message: result.success,
              type: "success"
            }
          });
          this.selectedArticle = new SelectionModel<any>(false);
          this.selection = new SelectionModel<any>(true, []);
        }
      }
      );
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }
}

