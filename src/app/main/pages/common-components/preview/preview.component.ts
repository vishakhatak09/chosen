import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-preview',
  template: `
  <div mat-dialog-content style="font-weight: 800; color: #444444;">
  <div>
    <button mat-icon-button matTooltip="Close" class="dialog-close-btn" (click)="dialogRef.close()">
        <mat-icon>close</mat-icon>
    </button>
  </div>
    <img [src]="dialogData.image">
  </div>
  `,
  styles: ['.dialog-close-btn{ float: right; }']
})
export class PreviewComponent implements OnInit {

  /**
     * Constructor
     * @param dialogData Dialog Data
     */
    constructor(
      @Inject(MAT_DIALOG_DATA) public dialogData: any,
      public dialogRef: MatDialogRef<PreviewComponent>,
  ) { }

  ngOnInit() {
  }

}
