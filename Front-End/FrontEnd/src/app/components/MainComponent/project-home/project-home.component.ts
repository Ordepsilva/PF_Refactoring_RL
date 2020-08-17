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



@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.css']
})
export class ProjectHomeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  project_name;
  project_id;
  isloaded = true;
  firstLabel = false;
  secondLabel = false;
  dataSource;
  articles = [];
  displayedColumns: string[] = ['title', 'year', 'createdAt', 'buttons'];

  constructor(public router: Router, public articleService: ArticleService, private data_service: dataService, public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.project_name = Cookies.get('project_name');
    this.project_id = Cookies.get('project_id');
    this.firstLabel = true;
    this.secondLabel = false;

    this.articleService.getArticlesFromProjectID(Cookies.get('project_id')).subscribe(
      (result: any) => {
        console.log(result);
        this.articles = result;
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

  loadViz() {
    const queryteste = "Match (a:Project)-[x]->(b:Article) where ID(a)=" + Cookies.get('project_id') + " WITH a,b,x OPTIONAL MATCH (b:Article)-[z]->(c:Article)   return a,x,z,b,c "
    const queryquery = "Match (a:Projeto)-[x]->(b:Article) where a.project_id='" + Cookies.get('project_id') + "' return a,x,b  UNION  Match(a:Article)-[x]->(b:Article) return a,x,b"
    const newquery = "Match (a:Projeto)-[x]->(b:Article) where a.project_id='" + Cookies.get('project_id') + "' OPTIONal MATCH (b:Article)-[r]->(b)  return a,x,b"
    const changequery = "MATCH (n:Projeto),(m:Article) WHERE n.project_id='" + Cookies.get('project_id') + "' OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m;";
    const query = "MATCH (n)-[x]->(p)   return n,p,x";
    let config = {
      container_id: "viz",
      server_url: "bolt://localhost:7687",
      server_user: "pedro",
      server_password: "teste",
      labels: {
        "Article": {
          "caption": "title",
        },
        "Projeto": {
          "caption": "project_name",
          "title_properties": [
            "project_name",
            "createdAt",
            "description",
            "subject"
          ]
        }
      },
      relationships: {
        [NeoVis.NEOVIS_DEFAULT_CONFIG]: {
          "thickness": "count"
        }
      },
      arrows: true,
      thickness: "count",
      initial_cypher: queryteste
    }
    let viz = new NeoVis.default(config);
    viz.render();
  }

  setLabel1() {
    this.firstLabel = true;
    this.secondLabel = false;
  }

  setLabel2() {
    this.firstLabel = false;
    this.secondLabel = true;
    this.loadViz();
  }

  deleteArticle(element: any) {
    this.data_service.optionString = "delete";
    console.log(element.title);
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "400px", data: {
        articleID: element.articleID,
        title:element.title,
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
      width: "500px", data:{
        article : element,
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

  ver(row: any) {
    this.router.navigate(["/projectHome"]);
  }

  createArticle() {
    this.data_service.optionString = "create";
    const dialogRef = this.dialog.open(ArticleDialogComponent, { 
      width: "500px", data:{
        project_id : this.project_id,

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
  // Criar template para criar artigo
  // Eliminar fica igual
  // Editar 
  // Template para project Info
  // loadViz arranjar maneira de o retornar do backend e apenas chamar a config para dar render
  // Overflow na tabela para aparecer o scroll
  // meter a parte de cima estática da tabela
}

