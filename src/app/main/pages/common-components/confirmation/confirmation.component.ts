import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation-dialog',
    template: `
        <div class="confirm" mat-dialog-content style="font-weight: 800; color: #444444;">
            {{ dialogData.msg }}
        </div>
        <div mat-dialog-actions style=" float: right; margin-top: 15px;">
            <button type="button" mat-button tabindex="1" (click)="onConfirmation()">Yes</button>
            <button type="button" mat-button tabindex="2" (click)="dialogRef.close()">No</button>
        </div>
  `,
    styles: [],
})
export class ConfirmationDialogComponent implements OnInit {


    /**
     * Constructor
     * @param dialogData Dialog Data
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    ) { }

    /**
     * On init
     */
    ngOnInit() { }

    /**
     * On Clicking Yes
     */
    onConfirmation(): void {
        this.dialogRef.close(true);
    }


}
