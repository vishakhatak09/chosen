import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkModel } from 'core/models/resumebuilder.model';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    // dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-work',
  template: `
  <h1 mat-dialog-title>Add work details</h1>
  <div mat-dialog-content>

    <form fxLayout="row wrap" #workForm="ngForm" fxLayoutAlign="start start"
      name="WorkForm" (ngSubmit)="submitForm()">

        <mat-form-field floatLabel="always" class="w-100-p" >
            <mat-label hidden>Designation</mat-label>
            <input matInput placeholder="Designation" type="text"
                [(ngModel)]="userWork.designation"
                name="DesignationName" autocomplete="off">
        </mat-form-field>

        <mat-form-field floatLabel="always" class="w-49">
            <mat-label hidden>Company name</mat-label>
            <input matInput placeholder="Company name" type="text"
                [(ngModel)]="userWork.companyName"
                name="CompanyName" autocomplete="off">
        </mat-form-field>
        <mat-form-field floatLabel="always" class="w-50-p" >
            <mat-label hidden>Location</mat-label>
            <input matInput placeholder="Location" type="text" name="LocationName"
                [(ngModel)]="userWork.location"
                autocomplete="off">
        </mat-form-field>
        &nbsp;
        <mat-form-field floatLabel="always" class="w-49" >
            <mat-label hidden>Joining Date</mat-label>
            <input matInput [matDatepicker]="picker"
                [(ngModel)]="userWork.joiningDate"
                placeholder="Joining Date" name="joiningDate"
                autocomplete="off" >
            <mat-datepicker-toggle matPrefix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker disabled="false"
              startView="multi-year"
              (yearSelected)="chosenYearHandler($event, 'joiningDate')"
              (monthSelected)="chosenMonthHandler($event, picker, 'joiningDate')"
              panelClass="example-month-picker"
            >
            </mat-datepicker>
        </mat-form-field>
        &nbsp;
        <mat-form-field floatLabel="always" class="w-50-p" >
            <mat-label hidden>Leaving Date</mat-label>
            <input matInput [matDatepicker]="picker2"
                [(ngModel)]="userWork.leavingDate"
                placeholder="Leaving Date" name="LeavingDate" [max]="maxDate"
                autocomplete="off" >
            <mat-datepicker-toggle matPrefix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2 disabled="false"
              startView="multi-year"
              (yearSelected)="chosenYearHandler($event, 'leavingDate')"
              (monthSelected)="chosenMonthHandler($event, picker, 'leavingDate')"
              panelClass="example-month-picker"
            >
            </mat-datepicker>
        </mat-form-field>
        <div class="w-50-p"></div>
        <div class="w-50-p">
          <mat-checkbox name="current" [(ngModel)]="userWork.isTillDate"
            (ngModelChange)="setCurrentDate(userWork.isTillDate)"
          >Currently working</mat-checkbox>
        </div>
        <div mat-dialog-actions>
          <button type="button" mat-button mat-dialog-close>Close</button>
          <button type="submit" mat-button>Save</button>
        </div>
    </form>
  </div>

  `,
  styleUrls: ['./add-work.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddWorkComponent implements OnInit, OnDestroy {

  public maxDate = moment();
  userWork = new WorkModel();
  @ViewChild('workForm', { static: false }) workForm: NgForm;


  /**
   * Constructor
   * @param data Dialog Data
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddWorkComponent>,
  ) {
    // this.userWork.joiningDate = this.maxDate;
  }

  /**
   * On init
   */
  ngOnInit() { }

  chosenYearHandler(normalizedYear: moment.Moment, type: 'joiningDate' | 'leavingDate') {
    const ctrlValue = normalizedYear;
    ctrlValue.year(normalizedYear.year());
    this.userWork[type] = ctrlValue;
  }

  chosenMonthHandler(
    normalizedMonth: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>,
    type: 'joiningDate' | 'leavingDate'
  ) {
    const ctrlValue = normalizedMonth;
    ctrlValue.month(normalizedMonth.month());
    this.userWork[type] = ctrlValue;
    datepicker.close();
  }

  /**
   * Submit form
   */
  submitForm(): void {
    console.log('userWork', this.userWork);
    this.dialogRef.close(this.userWork);
  }

  /**
   * Reset form
   */
  reset(): void {
    this.workForm.reset();
  }

  /**
   * Set till date
   * @param isChecked
   */
  setCurrentDate(isChecked: boolean) {
    if ( isChecked ) {
      this.userWork.leavingDate = this.maxDate;
    } else {
      this.userWork.leavingDate = null;
    }
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.reset();
  }

}
