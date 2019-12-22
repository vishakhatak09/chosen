import { Component, Inject, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkModel } from 'core/models/resumebuilder.model';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { fuseAnimations } from '@fuse/animations';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM-YYYY',
  },
  display: {
    dateInput: 'MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    // dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
import 'tinymce/tinymce.min.js';
declare var tinymce: any;

@Component({
  selector: 'app-add-work',
  template: `
  <h1 mat-dialog-title>
    Add work details
    <button mat-icon-button matTooltip="Close"
        [matTooltipPosition]="'above'"
        (click)="dialogRef.close()" class="dialog-close-btn">
        <mat-icon>close</mat-icon>
    </button>
  </h1>
  <div mat-dialog-content>

    <form fxLayout="row wrap" fxLayoutGap="25px" #workForm="ngForm" [formGroup]="userWorkForm"
      name="WorkForm" (ngSubmit)="submitForm()">

        <mat-form-field floatLabel="always" fxFlex.xs="100" fxFlex="100" appearance="outline">
            <mat-label hidden>Designation</mat-label>
            <input matInput placeholder="Designation" type="text"
                formControlName="designation"
                name="DesignationName" autocomplete="off">
            <mat-error *ngIf="userWorkForm.get('designation').hasError('required')">
              Please enter designation
            </mat-error>
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" appearance="outline">
            <mat-label hidden>Company name</mat-label>
            <input matInput placeholder="Company name" type="text"
                formControlName="companyName"
                name="CompanyName" autocomplete="off">
            <mat-error *ngIf="userWorkForm.get('companyName').hasError('required')">
              Please enter company name
            </mat-error>
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" appearance="outline">
            <mat-label hidden>Location</mat-label>
            <input matInput placeholder="Location" type="text" name="LocationName"
            formControlName="location" autocomplete="off">
            <mat-error *ngIf="userWorkForm.get('location').hasError('required')">
              Please enter work location
            </mat-error>
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" appearance="outline">
            <mat-label hidden>Joining Date</mat-label>
            <input matInput [matDatepicker]="picker"
                formControlName="joiningDate"
                placeholder="Joining Date" name="joiningDate"
                [max]="userWork.leavingDate || maxDate" name="JoiningDate"
                (click)="handlePicker($event, picker)" (keydown)="handlePicker($event, picker, true)"
                autocomplete="off" >
            <mat-datepicker-toggle matPrefix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker disabled="false"
              startView="multi-year"
              (yearSelected)="chosenYearHandler($event, 'joiningDate')"
              (monthSelected)="chosenMonthHandler($event, picker, 'joiningDate')"
              panelClass="example-month-picker"
            >
            </mat-datepicker>
            <mat-error *ngIf="userWorkForm.get('joiningDate').hasError('required')">
              Please select joining date
            </mat-error>
            <mat-error *ngIf="dateValidError == true">
              Joining Date must be less than Leaving Date
            </mat-error>
        </mat-form-field>

        <mat-form-field floatLabel="always" fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)" appearance="outline">
            <mat-label hidden>Leaving Date</mat-label>
            <input matInput [matDatepicker]="picker2"
                formControlName="leavingDate"
                placeholder="Leaving Date" name="LeavingDate" [max]="maxDate"
                autocomplete="off"
                (click)="handlePicker($event, picker2)" (keydown)="handlePicker($event, picker2, true)">
            <mat-datepicker-toggle matPrefix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2 disabled="false"
              startView="multi-year"
              (yearSelected)="chosenYearHandler($event, 'leavingDate')"
              (monthSelected)="chosenMonthHandler($event, picker2, 'leavingDate')"
              panelClass="example-month-picker"
            >
            </mat-datepicker>
            <mat-error *ngIf="userWorkForm.get('leavingDate').hasError('required')">
              Please select leaving date
            </mat-error>
        </mat-form-field>

        <div fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)"></div>
        <div fxFlex.xs="calc(100%-25px)" fxFlex="calc(50%-25px)">
          <mat-checkbox name="current" formControlName="isTillDate" (change)="setCurrentDate($event.checked)"
          >Currently working</mat-checkbox>
        </div>

        <div fxFlex.xs="100" fxFlex="100">
          <ng-container *ngTemplateOutlet="editor"></ng-container>
            <ng-template matTabContent #editor>
                <label>Description</label>
                <editor [id]="'jobDescriptionArea'" autofocus class="tiny-editor"
                [init]="tinyEditorConfig" placeholder="Job profile description" [formControlName]="'jobDescription'" tagName="textarea">
                </editor>
                <mat-error *ngIf="userWorkForm.get('jobDescription').touched &&
                userWorkForm.get('jobDescription').value == '' ">
                    Please fill in job profile description
                </mat-error>
            </ng-template>
        </div>

        <div mat-dialog-actions>
          <button type="submit" class="accent" mat-raised-button>Save</button>
        </div>
    </form>
  </div>
  `,
  styleUrls: ['./add-work.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  animations: fuseAnimations
})
export class AddWorkComponent implements OnInit, OnDestroy {

  public maxDate = moment();
  userWork = new WorkModel();
  @ViewChild('workForm', { static: false }) workForm: NgForm;
  dateValidError = false;
  str = String;
  public userWorkForm: FormGroup;
  tinyEditorConfig = {};

  /**
   * Constructor
   * @param dialogRef Dialog Reference
   * @param dialogData Dialog Data
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<AddWorkComponent>,
    private formbuilder: FormBuilder
  ) {

    this.userWorkForm = this.formbuilder.group({
      companyName: ['', [Validators.required]],
      location: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      joiningDate: ['', [Validators.required]],
      leavingDate: ['', [Validators.required]],
      jobDescription: ['', [Validators.required]],
      isTillDate: ['', []],
    });

    if (this.dialogData) {
      // const data = Array.from([this.dialogData]);
      const data = [this.dialogData];
      const workData = data.slice();
      this.userWork = workData[0];
      this.userWorkForm.setValue({
        companyName: this.userWork.companyName,
        location: this.userWork.location,
        designation: this.userWork.designation,
        joiningDate: this.userWork.joiningDate,
        leavingDate: this.userWork.leavingDate,
        isTillDate: moment(this.userWork.leavingDate).year() === moment().year() &&
          moment(this.userWork.leavingDate).month() === moment().month() ? true : false,
        jobDescription: this.userWork.jobDescription || ''
      });
    }

    this.setupTinyMce();
  }

  /**
   * On init
   */
  ngOnInit() {

    this.userWorkForm.valueChanges
      .subscribe((value) => {
        if (value.joiningDate && value.leavingDate) {
          if (value.joiningDate > value.leavingDate) {
            this.dateValidError = true;
          } else {
            this.dateValidError = false;
          }
        } else {
          this.dateValidError = false;
        }
      });

  }

  private setupTinyMce(): void {
    tinymce.baseURL = 'assets'; // Need to display proper editor with its its folder in assets folder
    this.tinyEditorConfig = {
      // selector: 'textarea#editorId',
      // skin_url: '/skins', // Or loaded from your environments config
      suffix: '.min',       // Suffix to use when loading resources
      plugins: 'lists advlist',
      statusbar: false,
      browser_spellcheck: true,
      toolbar: 'bold italic underline | bullist numlist |  undo redo',
      height: 300,
      menubar: false,
      header: false,
    };
    tinymce.init(this.tinyEditorConfig);
  }

  /**
   * On Year Selection
   * @param normalizedYear Selected year
   * @param type Type of form field
   */
  chosenYearHandler(normalizedYear: moment.Moment, type: 'joiningDate' | 'leavingDate') {
    const ctrlValue = normalizedYear;
    ctrlValue.year(normalizedYear.year());
    this.userWork[type] = ctrlValue;
    this.userWorkForm.get(type).setValue(ctrlValue);
  }

  /**
   * On Month Selection
   * @param normalizedYear Selected month
   * @param datepicker Selected picker
   * @param type Type of form field
   */
  chosenMonthHandler(
    normalizedMonth: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>,
    type: 'joiningDate' | 'leavingDate'
  ) {
    const ctrlValue = normalizedMonth;
    ctrlValue.month(normalizedMonth.month());
    this.userWork[type] = ctrlValue;
    this.userWorkForm.get(type).setValue(ctrlValue);
    datepicker.close();
    if (type === 'leavingDate') {
      if (ctrlValue.year() === moment().year() && ctrlValue.month() === moment().month()) {
        this.userWorkForm.get('isTillDate').setValue(true);
      } else {
        this.userWorkForm.get('isTillDate').setValue(false);
      }
    }
  }

  /**
   * Submit form
   */
  submitForm(): void {
    if (this.userWorkForm.valid) {
      this.dialogRef.close(this.userWorkForm.value);
    }
  }

  /**
   * Reset form
   */
  reset(): void {
    this.workForm.reset();
    this.userWorkForm.reset();
  }

  /**
   * Set till date
   * @param isChecked
   */
  setCurrentDate(isChecked: boolean) {
    if (isChecked) {
      this.userWork.leavingDate = this.maxDate;
      this.userWorkForm.get('leavingDate').setValue(this.maxDate);
    } else {
      this.userWork.leavingDate = null;
      this.userWorkForm.get('leavingDate').setValue(null);
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
