import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { EducationModel } from 'core/models/resumebuilder.model';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
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
        (click)="dialogRef.close()" class="dialog-close-btn">
        <mat-icon>close</mat-icon>
    </button>
  </h1>
  <div mat-dialog-content>

    <form fxLayout="row wrap" fxLayoutGap="25px" #eduForm="ngForm" [formGroup]="userEduForm"
      name="EduForm" (ngSubmit)="submitForm()">

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" appearance="outline">
            <mat-label hidden>College Name</mat-label>
            <input matInput placeholder="College Name" type="text"
                formControlName="collegeName"
                name="CollegeName" autocomplete="off">
            <mat-error *ngIf="userEduForm.get('collegeName').hasError('required')">
              Please enter college name
            </mat-error>
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" appearance="outline">
            <mat-label hidden>University Name</mat-label>
            <input matInput placeholder="University Name" type="text"
                formControlName="universityName"
                name="UniversityName" autocomplete="off">
            <mat-error *ngIf="userEduForm.get('universityName').hasError('required')">
              Please enter university name
            </mat-error>
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" appearance="outline">
            <mat-label hidden>Course Name</mat-label>
            <input matInput placeholder="Course Name" type="text" name="CourseName"
                formControlName="courseName"
                autocomplete="off">
            <mat-error *ngIf="userEduForm.get('courseName').hasError('required')">
              Please enter course name
            </mat-error>
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" appearance="outline">
            <mat-label hidden>Year of passing</mat-label>
            <input matInput [matDatepicker]="picker"
                formControlName="yearOfPassing" placeholder="Year of passing" name="YearOfPassing"
                [max]="maxDate" (click)="handlePicker($event, picker)" (keydown)="handlePicker($event, picker, true)"
                autocomplete="off" >
            <mat-datepicker-toggle matPrefix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker disabled="false"
              startView="multi-year"
              (yearSelected)="chosenYearHandler($event, picker)"
              panelClass="example-month-picker"
            >
            </mat-datepicker>
            <mat-error *ngIf="userEduForm.get('yearOfPassing').hasError('required')">
              Please select year of passing
            </mat-error>
        </mat-form-field>

        <div fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)"></div>
        <div fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)">
          <mat-checkbox name="current" formControlName="isCurrentlyPursuing"
            (change)="setCurrentDate($event.checked)"
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
  animations: fuseAnimations
})
export class AddEducationComponent implements OnInit, OnDestroy {

  public maxDate = moment();
  educationDetail = new EducationModel();
  @ViewChild('eduForm', { static: false }) eduForm: NgForm;
  public userEduForm: FormGroup;

  /**
   * Constructor
   * @param dialogData Dialog Data
   * @param dialogRef Dialog Reference
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<AddEducationComponent>,
    private formbuilder: FormBuilder
  ) {

    this.userEduForm = this.formbuilder.group({
      collegeName: ['', [Validators.required]],
      universityName: ['', [Validators.required]],
      courseName: ['', [Validators.required]],
      yearOfPassing: ['', [Validators.required]],
      isCurrentlyPursuing: [false, [Validators.required]],
    });

    if (this.dialogData) {
      const dialogdata = Array.from([this.dialogData]);
      const data = dialogdata;
      const eduData = data.slice();
      this.educationDetail = eduData[0];
      this.userEduForm.setValue({
        collegeName: this.educationDetail.collegeName,
        universityName: this.educationDetail.universityName,
        courseName: this.educationDetail.courseName,
        yearOfPassing: this.educationDetail.yearOfPassing,
        isCurrentlyPursuing: moment(this.educationDetail.yearOfPassing).year() === moment().year() ? true : false,
      });
    }

  }

  /**
   * On init
   */
  ngOnInit() { }

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
    this.userEduForm.get('yearOfPassing').setValue(ctrlValue);
    datepicker.close();
    if (normalizedYear.year() === moment().year()) {
      this.userEduForm.get('isCurrentlyPursuing').setValue(true);
    } else {
      this.userEduForm.get('isCurrentlyPursuing').setValue(false);
    }
  }

  /**
   * Submit form
   */
  submitForm(): void {
    if (this.userEduForm.valid) {
      this.dialogRef.close(this.userEduForm.value);
    }
  }

  /**
   * Reset form
   */
  reset(): void {
    this.eduForm.reset();
    this.userEduForm.reset();
  }

  /**
   * Set till date
   * @param isChecked
   */
  setCurrentDate(isChecked: boolean) {
    if (isChecked) {
      this.educationDetail.yearOfPassing = this.maxDate;
      this.userEduForm.get('yearOfPassing').setValue(this.maxDate);
    } else {
      this.educationDetail.yearOfPassing = null;
      this.userEduForm.get('yearOfPassing').setValue(null);
    }
  }

  /**
   * Handle datepicker input
   */
  handlePicker(event: KeyboardEvent, picker: MatDatepicker<moment.Moment>, isTyping = false): void {
    if (isTyping) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    if (picker && picker.opened) {
      picker.close();
    } else {
      picker.open();
    }
    event.stopPropagation();
    event.preventDefault();
    return;
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.reset();
  }

}
