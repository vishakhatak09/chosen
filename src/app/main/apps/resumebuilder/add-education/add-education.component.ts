import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-education',
  template: `
  <h1 mat-dialog-title>Add education details</h1>
  <div mat-dialog-content>

    <form fxLayout="row wrap" #workForm="ngForm" fxLayoutAlign="start start"
      name="WorkForm" (ngSubmit)="submitForm(workForm)">

        <mat-form-field floatLabel="always" class="w-50-p" appearance="outline">
            <mat-label>College name</mat-label>
            <input matInput placeholder="College name" type="text"
                name="CollegeName" autocomplete="off">
        </mat-form-field>
        <mat-form-field floatLabel="always" class="w-50-p" appearance="outline">
            <mat-label>University Name</mat-label>
            <input matInput placeholder="University Name" type="text" name="UniversityName"
                autocomplete="off">
        </mat-form-field>
        <mat-form-field floatLabel="always" class="w-50-p" appearance="outline">
            <mat-label>Course Name</mat-label>
            <input matInput placeholder="Course Name" type="text"
                name="CourseName" autocomplete="off">
        </mat-form-field>

        <mat-form-field floatLabel="always" class="w-50-p" appearance="outline">
            <mat-label>Year of passing</mat-label>
            <input matInput [matDatepicker]="picker" name="yearOfPassing" [max]="maxDate"
                autocomplete="off" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker disabled="false"></mat-datepicker>
        </mat-form-field>

    </form>
  </div>
  <div mat-dialog-actions>
    <button type="button" mat-button mat-dialog-close>Close</button>
    <button type="submit" mat-button>Save</button>
  </div>
  `,
  styleUrls: ['./add-education.component.scss']
})
export class AddEducationComponent implements OnInit {

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
