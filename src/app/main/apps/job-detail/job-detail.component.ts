import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobModel } from 'core/models/job.model';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JobDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: JobModel,
  ) { }

  ngOnInit() {
  }

  applyJob(): void {
    if (this.dialogData) {
      this.dialogRef.close(true);
    }
  }

}
