import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-work',
  template: `
  <h1 mat-dialog-title>Add work details</h1>
  <div mat-dialog-content>

    <form fxLayout="row wrap" #workForm="ngForm" fxLayoutAlign="start start"
      name="WorkForm" (ngSubmit)="submitForm(workForm)">

        <mat-form-field floatLabel="always" class="w-100-p" appearance="outline">
            <mat-label>Company name</mat-label>
            <input matInput placeholder="Company name" type="text"
                name="CompanyName" autocomplete="off">
        </mat-form-field>
        <mat-form-field floatLabel="always" class="w-50-p" appearance="outline">
            <mat-label>Location</mat-label>
            <input matInput placeholder="Location" type="text" name="LocationName"
                autocomplete="off">
        </mat-form-field>
        <mat-form-field floatLabel="always" class="w-50-p" appearance="outline">
            <mat-label>Designation</mat-label>
            <input matInput placeholder="Designation" type="text"
                name="DesignationName" autocomplete="off">
        </mat-form-field>

        <mat-form-field floatLabel="always" class="w-50-p" appearance="outline">
            <mat-label>Joining Date</mat-label>
            <input matInput [matDatepicker]="picker" name="joiningDate" [max]="maxDate"
                autocomplete="off" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker disabled="false"></mat-datepicker>
        </mat-form-field>

        <mat-form-field floatLabel="always" class="w-50-p" appearance="outline">
            <mat-label>Leaving Date</mat-label>
            <input matInput [matDatepicker]="picker2" name="leavingDate" [max]="maxDate"
                autocomplete="off" required>
            <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2 disabled="false"></mat-datepicker>
        </mat-form-field>

    </form>
  </div>
  <div mat-dialog-actions>
    <button type="button" mat-button mat-dialog-close>Close</button>
    <button type="submit" mat-button>Save</button>
  </div>
  `,
  styleUrls: ['./add-work.component.scss']
})
export class AddWorkComponent implements OnInit {

  maxDate = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  submitForm(formData): void {
    console.log(formData);
  }

}
