import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.css']
})
export class ProjectHomeComponent implements OnInit {
  project_name;
  constructor() { }
  isloaded = true;
  
  ngOnInit(): void {
    this.project_name = "teste";
  }


  project_info(){
    alert("nothing");
  }
}
