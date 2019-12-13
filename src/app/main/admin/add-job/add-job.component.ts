import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AppConstant } from 'core/constants/app.constant';
import { Options } from 'ng5-slider';
import { CommonService } from 'core/services/common.service';
import { CityModel, JobModel } from 'core/models/job.model';
import { JobIndustry, JobCategory } from 'core/constants/job-constant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddJobComponent implements OnInit, OnDestroy {

  public isLoading = false;
  addJobForm: FormGroup;
  jobTypeOptions = AppConstant.JobTypeOptions;
  minExperience = 0;
  maxExperience = 0;
  options: Options = {
    floor: 0,
    ceil: 30,
    step: 1,
    minLimit: 0,
    maxLimit: 10,
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

  public addJobDataApiUrl = environment.serverBaseUrl + 'admin/job/createJob';
  public getSingleJobDataApiUrl = environment.serverBaseUrl + 'admin/job/singleJob';
  public updateJobDataApiUrl = environment.serverBaseUrl + 'admin/job/updateJob';

  // Private
  private _unsubscribeAll: Subject<any> = new Subject();
  private jobId: string;
  editJobData;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.SalaryOptions = this.commonService.getSalaryOptions();
    this.StateList = this.commonService.getStateList();
    this.jobId = this.activatedRoute.snapshot.paramMap.get('jobId');
    if (this.jobId) {
      this.getSingleJob();
    }
  }

  getCityFromState(event: MatAutocompleteSelectedEvent): void {
    const stateId = event.option.value;

    this.CityList = this.commonService.getCity(stateId);
  }

  ngOnInit() {

    this.addJobForm = this.formBuilder.group({
      jobPosition: ['', Validators.required],
      jobDescription: ['', Validators.required],
      state: ['', Validators.required],
      location: ['', Validators.required],
      companyName: ['', Validators.required],
      keywords: ['', Validators.required],
      workExperience: ['', Validators.required],
      expectedSalary: [''],
      industry: ['', Validators.required],
      jobCategory: ['', Validators.required],
      jobType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.initSearch();

  }

  initSearch(): void {

    this.filteredStateOptions = this.addJobForm.get('state').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._stateFilter(value) : this.StateList.slice())
    );

    this.filteredCityOptions = this.addJobForm.get('location').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._cityFilter(value) : this.CityList.slice())
    );

    this.filteredIndustryOptions = this.addJobForm.get('industry').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._industryJobTypeFilter(value, 'industry') : this.JobIndustryList.slice())
    );

    this.filteredCategoryOptions = this.addJobForm.get('jobCategory').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._industryJobTypeFilter(value, 'jobCategory') : this.JobCategoryList.slice())
    );

  }

  private _stateFilter(value: string): string[] {
    if (typeof value === 'string') {
      this.CityList = [];
      this.addJobForm.get('location').reset();
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

    if (this.addJobForm.valid) {

      let currentApi = this.addJobDataApiUrl;

      const formValues = this.addJobForm.value;
      const params: any = {
        'params': {
          'jobPosition': formValues.jobPosition,
          'jobDescription': formValues.jobPosition,
          'companyName': formValues.companyName,
          'jobType': formValues.jobType,
          'location': formValues.location + ', ' + formValues.state,
          'workExperience': {
            'years': this.maxExperience,
            'month': '0'
          },
          'salary': formValues.expectedSalary,
          'industry': formValues.industry,
          'jobCategory': formValues.jobCategory,
          'email': formValues.email
        }
      };
      if (this.jobId) {
        params.params.id = this.jobId;
        currentApi = this.updateJobDataApiUrl;
      }

      this.commonService.addUpdateJob(currentApi, params)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (response) => {
            this.router.navigate(['/ad/job-mgmt']);
          },
          (error) => {
            // console.log(error);
          }
        );
    }

  }

  getSingleJob(): void {

    const params = {
      'params': {
        'jobId': this.jobId
      }
    };

    this.commonService.getSingleJob(this.getSingleJobDataApiUrl, params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          // console.log(response);
          if (response.code === 200 && response.data) {
            this.editJobData = response.data;
            if ( this.editJobData ) {
              const state = this.editJobData.location ? this.editJobData.location.split(',')[1] : '';
              const location = this.editJobData.location ? this.editJobData.location.split(',')[0] : '';
              this.addJobForm.setValue({
                jobPosition: this.editJobData.jobPosition,
                jobDescription: this.editJobData.jobDescription,
                state: state.trim(),
                location: location,
                companyName: this.editJobData.companyName,
                keywords: this.editJobData.keywords || '',
                workExperience: [this.editJobData.workExperience['years'], this.editJobData.workExperience['month']],
                expectedSalary: this.editJobData.salary,
                industry: this.editJobData.industry,
                jobCategory: this.editJobData.jobCategory,
                jobType: this.editJobData.jobType,
                email: this.editJobData.email || '',
              });
              this.maxExperience = this.editJobData.workExperience['years'];
            }

          }
        },
        (error) => {
          // console.log(error);
        }
      );

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
