import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AppConstant } from 'core/constants/app.constant';
import { Options } from 'ng5-slider';
import { CommonService } from 'core/services/common.service';
import { MatSelectChange } from '@angular/material/select';
import { CityModel } from 'core/models/job.model';
import { JobIndustry, JobCategory } from 'core/constants/job-constant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

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
  public addJobDataApiUrl = environment.serverBaseUrl + 'admin/job/jobList';

  // Private
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private http: HttpClient,
    private router: Router
  ) {
    this.SalaryOptions = this.commonService.getSalaryOptions();
    this.StateList = this.commonService.getStateList();
  }

  getCityFromState(event: MatSelectChange): void {
    const stateId = event.value;
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
    });

  }

  onSubmit(): void {

    if (this.addJobForm.valid) {

      const formValues = this.addJobForm.value;
      const params = {
        'params': {
          'jobPosition': formValues.jobPosition,
          'jobDescription': formValues.jobPosition,
          'companyName': formValues.companyName,
          'jobType': formValues.jobType,
          'location': formValues.location + ', ' + formValues.state,
          'workExperience': {
            'years': formValues.workExperience,
            'month': '0'
          },
          'salary': formValues.expectedSalary,
          'industry': formValues.industry,
          'jobCategory': formValues.jobCategory
        }
      };

      this.http.post(this.addJobDataApiUrl, params)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (response) => {
            console.log(response);
            this.router.navigate(['/ad/job-mgmt']);
          },
          (error) => {
            console.log(error);
          }
        );
    }

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
