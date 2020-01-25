import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-view',
  template: `
  <h1 mat-dialog-title>
      Your pdf preview
      <button mat-icon-button matTooltip="Close" [matTooltipPosition]="'above'"
          (click)="dialogRef.close(false)"
          class="dialog-close-btn">
          <mat-icon>close</mat-icon>
      </button>&nbsp;
      <button type="button" class="accent save-btn" mat-raised-button
      (click)="dialogRef.close(true)">Download</button>
  </h1>
  <div mat-dialog-content>
  <iframe
        class="ajaxzoom_iframe"
        width="100%"
        frameborder="0"
        id="iframe"
        [src]="dialogData"
        scrolling="no"
        allowfullscreen style="height: 100%">
        </iframe>
  </div>
  `,
  styleUrls: ['./pdf-view.component.scss']
})
export class PdfViewComponent implements OnInit {
  objectData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any = '#toolbar=0',
    public dialogRef: MatDialogRef<PdfViewComponent>,
    private domsanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    if (this.dialogData) {
      this.dialogData = this.domsanitizer.bypassSecurityTrustResourceUrl(this.dialogData + '#toolbar=0');
    }
  }

}
