import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-resume-preview',
  template: `
    <div mat-dialog-content style="font-weight: 800; color: #444444;">
      <div>
        <button mat-icon-button matTooltip="Close" class="dialog-close-btn" (click)="dialogRef.close()">
            <mat-icon>close</mat-icon>
        </button>
      </div>
      <div [innerHTML]="previewContent">
      </div>
    </div>
  `,
  styleUrls: ['./resume-preview.component.scss'],
  animations: fuseAnimations
})
export class ResumePreviewComponent implements OnInit {

  // Public vars
  public previewContent: SafeHtml;

  /**
   * Constructor
   * @param dialogRef Dialog Reference
   * @param dialogData Dialog Data
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<ResumePreviewComponent>,
    private domsanitizer: DomSanitizer,
  ) {
    if (this.dialogData) {
      this.previewContent = this.domsanitizer.bypassSecurityTrustHtml(
        String(this.dialogData)
      );
    }
  }

  ngOnInit() { }

}
