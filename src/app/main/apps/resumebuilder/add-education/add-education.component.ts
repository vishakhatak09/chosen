import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { EducationModel } from 'core/models/resumebuilder.model';
import { NgForm } from '@angular/forms';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    // monthYearLabel: 'MMM YYYY',
    // dateA11yLabel: 'LL',
    // monthYearA11yLabel: 'MMMM YYYY',
    yearLabel: 'YYYY',
    yearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-add-education',
  template: `
  <h1 mat-dialog-title>
  Add education details
    <button mat-icon-button matTooltip="Close"
        [matTooltipPosition]="'above'"
        mat-dialog-close class="dialog-close-btn">
        <mat-icon>close</mat-icon>
    </button>
  </h1>
  <div mat-dialog-content>

    <form fxLayout="row wrap" fxLayoutGap="25px" #eduForm="ngForm"
      name="EduForm" (ngSubmit)="submitForm()">

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" >
            <mat-label hidden>College Name</mat-label>
            <input matInput placeholder="College Name" type="text"
                [(ngModel)]="educationDetail.collegeName"
                name="CollegeName" autocomplete="off">
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)">
            <mat-label hidden>University Name</mat-label>
            <input matInput placeholder="University Name" type="text"
                [(ngModel)]="educationDetail.universityName"
                name="UniversityName" autocomplete="off">
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" >
            <mat-label hidden>Course Name</mat-label>
            <input matInput placeholder="Course Name" type="text" name="CourseName"
                [(ngModel)]="educationDetail.courseName"
                autocomplete="off">
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" >
            <mat-label hidden>Year of passing</mat-label>
            <input matInput [matDatepicker]="picker"
                [(ngModel)]="educationDetail.yearOfPassing"
                placeholder="Year of passing" name="YearOfPassing"
                [max]="maxDate"
                autocomplete="off" >
            <mat-datepicker-toggle matPrefix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker disabled="false"
              startView="multi-year"
              (yearSelected)="chosenYearHandler($event, picker)"
              panelClass="example-month-picker"
            >
            </mat-datepicker>
        </mat-form-field>

        <div fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)"></div>
        <div fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)">
          <mat-checkbox name="current" [(ngModel)]="educationDetail.isCurrentlyPursuing"
            (ngModelChange)="setCurrentDate(educationDetail.isCurrentlyPursuing)"
          >Currently Pursuing</mat-checkbox>
        </div>
        <div mat-dialog-actions>
          <button type="submit" class="accent" mat-raised-button>Save</button>
        </div>
    </form>
  </div>



  `,
  styleUrls: ['./add-education.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddEducationComponent implements OnInit, OnDestroy {

  public maxDate = moment();
  educationDetail = new EducationModel();
  @ViewChild('eduForm', { static: false }) eduForm: NgForm;

  /**
   * Constructor
   * @param dialogData Dialog Data
   * @param dialogRef Dialog Reference
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<AddEducationComponent>,
  ) {
    if (this.dialogData) {
      this.educationDetail = this.dialogData;
    }
  }

  /**
   * On init
   */
  ngOnInit() {}

  /**
   * On Year Selection
   * @param normalizedYear Selected year
   */
  chosenYearHandler(
    normalizedYear: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>,
  ) {
    const ctrlValue = normalizedYear;
    ctrlValue.year(normalizedYear.year());
    this.educationDetail.yearOfPassing = ctrlValue;
    datepicker.close();
  }

  /**
   * Submit form
   */
  submitForm(): void {
    console.log('educationDetail', this.educationDetail);
    this.dialogRef.close(this.educationDetail);
  }

  /**
   * Reset form
   */
  reset(): void {
    this.eduForm.reset();
  }

  /**
   * Set till date
   * @param isChecked
   */
  setCurrentDate(isChecked: boolean) {
    if (isChecked) {
      this.educationDetail.yearOfPassing = this.maxDate;
    } else {
      this.educationDetail.yearOfPassing = null;
    }
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.reset();
  }

}
