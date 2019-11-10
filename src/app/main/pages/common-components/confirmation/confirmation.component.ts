import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation-dialog',
    template: `
        <div mat-dialog-content>
            {{ dialogData.msg }}
        </div>
        <div mat-dialog-actions>
            <button type="button" mat-button tabindex="1" (click)="onConfirmation()">Yes</button>
            <button type="button" mat-button tabindex="2" mat-dialog-close>No</button>
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
        private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
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
