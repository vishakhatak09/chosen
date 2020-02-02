import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-resume-preview',
  template: `
    <div mat-dialog-content style="font-weight: 800; color: #444444;">
      <div>
        <button mat-icon-button matTooltip="Close" class="dialog-close-btn" (click)="dialogRef.close()">
            <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="font-size-18">
          Do you want to select chosen resumes or upload your own ?
      </div>
      <div mat-dialog-actions>
        <div class="images first mat-elevation-z6" [ngStyle.sm]="{'height': '100px'}" [ngStyle.xs]="{'height': '100px'}"
          (click)="dialogRef.close(true)">
          <div>
            <mat-icon [ngClass.sm]="'s-40'" [ngClass.xs]="'s-40'" [ngClass.lg]="'s-80'" [ngClass.md]="'s-80'">
              done_outline
            </mat-icon>
          </div>
          <div class="font-size-20">Select Resume</div>
        </div>
        <div class="images mat-elevation-z6" [ngStyle.sm]="{'height': '100px'}" [ngStyle.xs]="{'height': '100px'}"
          (click)="dialogRef.close(false)">
          <div>
            <mat-icon  [ngClass.sm]="'s-40'" [ngClass.xs]="'s-40'" [ngClass.lg]="'s-80'" [ngClass.md]="'s-80'">
              cloud_upload
            </mat-icon>
          </div>
          <div class="font-size-20">Upload Resume</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./resume-preview.component.scss'],
  animations: fuseAnimations
})
export class ResumePreviewComponent implements OnInit {

  // Public vars

  /**
   * Constructor
   * @param dialogRef Dialog Reference
   * @param dialogData Dialog Data
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<ResumePreviewComponent>,
  ) {
    if (this.dialogData) {
    }
  }

  ngOnInit() { }

}
