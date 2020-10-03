import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ArticleService } from 'src/app/services/article/article.service';
import { dataService } from 'src/app/services/dataService';
import { ProjectsService } from 'src/app/services/project/projects.service';
import { ArticleDialogComponent } from '../article-dialog/article-dialog.component';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';


@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  files: any[] = [];
  uploadedFiles: any[] = [];
  myProjects: any[] = [];
  articles: any[] = [];
  displayedFileColumns: string[] = ['select', 'name', 'options'];
  displayedProjects: string[] = ['title'];
  displayArticles: string[] = ['select', 'title'];
  fileSource: any;
  projectSource: any;
  articleSource: any;
  isProjects: boolean = true;
  isArticles: boolean = false;
  selectedFile = new SelectionModel<any>(false);
  articleSelect = new SelectionModel<any>(false);

  constructor(public articleService: ArticleService, public dialog: MatDialog, public data_service: dataService, public projectService: ProjectsService) { }

  ngOnInit(): void {
    this.getAllUploadedFiles();
    this.getMyProjects();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectedFile.selected.length;
    const numRows = this.fileSource.length;
    return numSelected === numRows;
  }

  isAllSelectedArticle() {
    const numSelected = this.articleSelect.selected.length;
    const numRows = this.articleSource.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selectedFile.clear() :
      this.fileSource.data.forEach(row => this.selectedFile.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectedFile.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  checkboxLabelArticle(row?: any): string {
    if (!row) {
      return `${this.isAllSelectedArticle() ? 'select' : 'deselect'} all`;
    }
    return `${this.articleSelect.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    let decimals = 1;
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  getAllUploadedFiles(): void {
    this.articleService.getAllUploadedFiles().subscribe(result => {
      this.uploadedFiles = result;
      this.fileSource = new MatTableDataSource(result);
    }, (error => {
      console.log(error);
    }))
  }

  uploadFiles(): void {
    if (this.files.length > 0) {
      for (let i = 0; i < this.files.length; i++) {
        let formData: any = new FormData();
        formData.append("file", this.files[i]);
        this.articleService.uploadFile(formData).subscribe(result => {
          this.deleteFile(i);
          this.getAllUploadedFiles();
        }, (error => {
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            width: "400px", data: {
              message: error.error.error,
              type: "failed"
            }
          })
        }))
      }
    }
  }

  deleteFileFromUploaded(file: any): void {
    let filename = file;

    this.data_service.optionString = "deleteFile";
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: "400px", data: {
        filename: filename
      }
    }).afterClosed().subscribe(result => {
      this.getAllUploadedFiles();
      if (result.result) {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: result.result.success,
            type: "success"
          }
        })
      }
    });
  }

  getAllArticlesFromProject(element: any) {
    console.log(element);
    this.articleService.getArticlesFromProjectID(element).subscribe(result => {
      this.articles = result;
      this.articleSource = new MatTableDataSource(this.articles);
      this.isArticles = true;
      this.isProjects = false;
    })
  }

  getMyProjects(): void {
    this.projectService.getProjectsForUser().subscribe(result => {
      this.myProjects = result;
      this.projectSource = new MatTableDataSource(this.myProjects);
    }, (error => {
      console.log(error);
    }))
  }

  setProjectsTable() {
    this.isArticles = false;
    this.isProjects = true;
  }

  addFileToArticle() {
    let filename = this.selectedFile.selected[0];
    let articleID = this.articleSelect.selected[0].articleID;
    let body: any = {};
    body.filename = filename;
    
    if (articleID && filename) {
      this.articleService.associateFileToArticleID(body, articleID).subscribe(result => {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: result.success,
            type: "success"
          }
        });
      }, (error => {
        console.log(error);
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: "400px", data: {
            message: error.error.error,
            type: "failed"
          }
        });
      }));
    } else if (!filename) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: "You need to select one File",
          type: "failed"
        }
      });
    } else if (!this.articleSelect.selected[0]) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: "400px", data: {
          message: "You need to select one article",
          type: "failed"
        }
      });
    }
  }
}
