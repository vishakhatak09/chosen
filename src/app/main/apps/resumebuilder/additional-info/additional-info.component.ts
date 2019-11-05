import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdditionalModel } from 'core/models/resumebuilder.model';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss'],
})
export class AdditionalInfoComponent implements OnInit {

  additionalInfo: AdditionalModel;

  /**
   * Constructor
   * @param dialogRef Dialog Reference
   * @param dialogData Dialog Data
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<AdditionalInfoComponent>,
  ) {
    if (this.dialogData) {
      this.additionalInfo = this.dialogData;
    }
  }

  /**
   * On init
   */
  ngOnInit() { }

  /**
   * Submit form data
   */
  submitForm(): void {
    this.dialogRef.close(this.additionalInfo);
  }

}
