import { Component, OnInit, Inject, Optional, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppConstant } from 'core/constants/app.constant';
import { Options } from 'ng5-slider';
import { CityModel } from 'core/models/job.model';
import { JobIndustry, JobCategory } from 'core/constants/job-constant';
import { Observable } from 'rxjs';
import { CommonService } from 'core/services/common.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.scss']
})
export class JobFilterComponent implements OnInit {

  filterJobForm: FormGroup;
  jobTypeOptions = AppConstant.JobTypeOptions;
  minExperience = 0;
  maxExperience = 0;
  options: Options = {
    floor: 0,
    ceil: 30,
    step: 1,
    minLimit: 0,
    maxLimit: 30,
    showTicks: true
  };
  minSalary = 0;
  maxSalary = 0;
  salaryOptions: Options = {
    floor: 0,
    ceil: 100,
    step: 5,
    minLimit: 0,
    maxLimit: 100,
    showTicks: true
  };
  SalaryOptions = [];
  StateList: string[] = [];
  CityList: CityModel[] = [];
  JobIndustryList: string[] = JobIndustry;
  JobCategoryList: string[] = JobCategory;

  filteredStateOptions: Observable<string[]>;
  filteredCityOptions: Observable<CityModel[]>;
  filteredIndustryOptions: Observable<string[]>;
  filteredCategoryOptions: Observable<string[]>;
  selectedIndustries: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('indInput', { static: false }) industryInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoIndustry', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<JobFilterComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _fb: FormBuilder,
    private commonService: CommonService
  ) {
    this.SalaryOptions = this.commonService.getSalaryOptions();
    this.StateList = this.commonService.getStateList();
  }

  ngOnInit() {

    this.filterJobForm = this._fb.group({
      locationState: [''],
      location: [''],
      workExperience: [''],
      salary: [''],
      industry: [''],
      jobCategory: [''],
      keyskill: [''],
    });
    this.initSearch();

    if (this.dialogData) {
      if ( this.dialogData.industry ) {
        this.selectedIndustries = this.dialogData.industry;
      }
      this.filterJobForm.setValue(this.dialogData);
    }

  }

  getCityFromState(event: MatAutocompleteSelectedEvent): void {
    const stateId = event.option.value;

    this.CityList = this.commonService.getCity(stateId);
  }

  initSearch(): void {

    this.filteredStateOptions = this.filterJobForm.get('locationState').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._stateFilter(value) : this.StateList.slice())
    );

    this.filteredCityOptions = this.filterJobForm.get('location').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._cityFilter(value) : this.CityList.slice())
    );

    this.filteredIndustryOptions = this.filterJobForm.get('industry').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._industryJobTypeFilter(value, 'industry') : this.JobIndustryList.slice())
    );

    this.filteredCategoryOptions = this.filterJobForm.get('jobCategory').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._industryJobTypeFilter(value, 'jobCategory') : this.JobCategoryList.slice())
    );

  }

  private _stateFilter(value: string): string[] {
    if (typeof value === 'string') {
      this.CityList = [];
      this.filterJobForm.get('location').reset();
      const filterValue = value.toLowerCase();
      return this.StateList.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

  private _cityFilter(value: string): CityModel[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.CityList.filter(option => option.city.toLowerCase().includes(filterValue));
    }
  }

  private _industryJobTypeFilter(value: string, type: 'industry' | 'jobCategory'): string[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      if (type === 'industry') {
        return this.JobIndustryList.filter(option => option.toLowerCase().includes(filterValue));
      } else {
        return this.JobCategoryList.filter(option => option.toLowerCase().includes(filterValue));
      }
    }
  }

  onSubmit(): void {
    if ( this.selectedIndustries.length > 0 ) {
      this.filterJobForm.get('industry').setValue(this.selectedIndustries);
    }
    this.dialogRef.close(this.filterJobForm.value);
  }

  addIndustry(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim() &&
        this.selectedIndustries.indexOf(value.trim()) === -1 &&
        this.JobIndustryList.indexOf(value.trim()) > -1
      ) {
        this.selectedIndustries.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.filterJobForm.get('industry').setValue(null);
    }
  }

  removeIndustry(fruit: string): void {
    const index = this.selectedIndustries.indexOf(fruit);

    if (index >= 0) {
      this.selectedIndustries.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (
      this.selectedIndustries.indexOf(value.trim()) === -1 &&
      this.JobIndustryList.indexOf(value.trim()) > -1
    ) {
      this.selectedIndustries.push(event.option.viewValue);
      this.industryInput.nativeElement.value = '';
      this.filterJobForm.get('industry').setValue(null);
    }
  }

}
