import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.scss']
})
export class JobFilterComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JobFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { }

  ngOnInit() {
  }

}
