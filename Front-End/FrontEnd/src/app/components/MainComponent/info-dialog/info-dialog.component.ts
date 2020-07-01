import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {
  success: boolean;
  failed: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
  
  ngOnInit(): void {
    if (this.data.type == "success"){
      this.success=true;
    }else if(this.data.type=="failed"){
      this.failed=true;
    }
  }

}
