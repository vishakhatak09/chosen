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
  minSalary = 0;
  maxSalary = 0;
  options: Options = {
    floor: 0,
    ceil: 30,
    step: 1,
    minLimit: 0,
    maxLimit: 30,
    showTicks: true
  };

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

  public addJobDataApiUrl = environment.serverBaseUrl + 'admin/job/createJob';
  public getSingleJobDataApiUrl = environment.serverBaseUrl + 'admin/job/singleJob';
  public updateJobDataApiUrl = environment.serverBaseUrl + 'admin/job/updateJob';
  public imgBaseUrl = environment.serverImagePath + 'job/';

  // Private
  private _unsubscribeAll: Subject<any> = new Subject();
  private jobId: string;
  editJobData;
  selectedFile: File;
  logoSrc: string | ArrayBuffer;
  logoFileName: string;

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
      // keywords: ['', Validators.required],
      workExperience: ['', Validators.required],
      expectedSalary: [''],
      industry: ['', Validators.required],
      jobCategory: ['', Validators.required],
      jobType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      logo: ['']
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
      const startWorkExp = {
        'years': formValues.workExperience[0],
        'month': '0'
      };
      const endWorkExp = {
        'years': formValues.workExperience[1],
        'month': '0'
      };
      const params: any = {
        'params': {
          'jobPosition': formValues.jobPosition,
          'jobDescription': formValues.jobPosition,
          'companyName': formValues.companyName,
          'jobType': formValues.jobType,
          'location': formValues.location + ', ' + formValues.state,
          'startworkExperience': startWorkExp,
          'endworkExperience': endWorkExp,
          'startSalary': formValues.expectedSalary[0],
          'endSalary': formValues.expectedSalary[1],
          'industry': formValues.industry,
          'jobCategory': formValues.jobCategory,
          'email': formValues.email,
          'imageName': this.selectedFile ? this.logoFileName : '',
          'photo': this.selectedFile ? this.logoSrc : '',
        }
      };
      if (this.jobId) {
        params.params.id = this.jobId;
        currentApi = this.updateJobDataApiUrl;
      }

      // const temp = {
      //   "params": {
      //     "imageName": "6dfb9fff02c5d21be5757919eadbcac6.png",
      //     "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAAA9CAIAAABTMLI6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAEnRFWHRFWElGOk9yaWVudGF0aW9uADGEWOzvAAAAIXRFWHRDcmVhdGlvbiBUaW1lADIwMTk6MDU6MDIgMjI6MDU6MzelCTz3AAADwUlEQVRoQ+2bTUhUURTHX1EQaX6QkIuZSFtIOWMYZE4SNWS5UAoioVy0yKBoUVEgRB9IHwhqahqRlC5a1KJFGO1UXIXSJnKycOGMOELOYKAyI4IuOr5z1HnPsd7HvW/uhX6Inr/jMPzfOffe/xvGTaHJ6aHBzxeqzygrFHk9TQ0PSdjg5avuDz2fSChKrrt8X/FNEuwY+FhFlcq27bt85V0kDLCZfnJgLDhOlUp2jpcqnmTtNPcqHP0PB75TpZKekUcVT3ZkmnsVXv6HAyNUrZCemU8VT0Tp/1gwRJVKliPDD5i9yvz6rxn+bJNtcQxu/Q9pNj9nht8CXPxHotFIJEpCxeyydAwu/nUnH5zJW7amkRAMLv51i1/Y5gNO9N/smewk//vPmlQlH2uw95+q5GMNDv5DGv/CJh+E+/yLPPwAY/+xeFyW5IMw9q9rvsjJB2HsP6jb/MRuPsDY/zdt/0VOPgjz+Zcm+SAs/etOfkDwzR9g6V+3+QmefBCm/Zcq+SAc+y/+8APM/EuXfBBm/qVLPggz/9IlH4SZf+mSD8Jw/iVLPggb/zImH4SNfxmTD8Ko/xImH4RL/2UZfoCBf0mTD8LAv6TJB2HgX9LkgzDwL2nyQZjMv5TJB7HrX97kg9j1L2/yQWz3X9rkg9j9/OfF2quJh7+35F5ObikJR9B9/tP4AMZmg0uLcVv9FzD5zEwHDH6Befh7W/6lTj6ILf9SJx/Eln+pkw9ic/4lTj6Idf+yJx/Eun/Zkw9i/fxvbuvo7RsgoSh5BTV7CmpIOIju/C/1lVG1AS73bpfLDcVhX1lGRmYS/3vz8160PyWxMSlPPojOP9ihyhhJ5h8Wdm//WmOTIvV7Poks+4eRQLFKc2vH+u0tEUGSz1S4nyqrqP5d7kuXr6Bepe7Og79cgpQnn+mpocCXxz+/tpJW+efiXw/N//36J7onw4TDJUj8B7ZEUpV8Fuaj46NvB/tqwTxcAvrtCjdu1VFlmOX9D6u5udnKCv9keALlKnAcnCr3nzzhJ61SUXWWKpVDx9p5H/4zvwO/Jvqnwn2k1wH9e/e+h4Rh1vwD3a87H9XfxVpHelqaz1dywOsp8hbGYvFr12/TAyr+08nHhAmwyMPBHrhdJZ0MOMnA/P5CD2nDaPzDCBwtPQjfSRsDkk/xkQYS9li+J1+Kw5AvzEcWF+OxuSDepdPDGwCdh/VrwTyg8Q88a2lsa2kkYRgYfpv7vxGfSWlqfX6u+jwJ8+j9A5UVx3+MaG5sxARmvrPrjYU9fw1F+QNRb6/fUX84OQAAAABJRU5ErkJggg==",
      //     "jobPosition": "java",
      //     "jobDescription": "java",
      //     "companyName": "node Pvt. Ltd.",
      //     "jobType": "navri bajar",
      //     "location": "tokiyo",
      //     "startworkExperience": {
      //       "years": "2",
      //       "month": "0"
      //     },
      //     "endworkExperience": {
      //       "years": "5",
      //       "month": "0"
      //     },
      //     "startSalary": "15000",
      //     "endSalary": "20000",
      //     "industry": "fashion",
      //     "jobCategory": "companyjob",
      //     "email": "pateldarshan2121.dp@gmail.com"
      //   }
      // };

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
            if (this.editJobData) {
              const state = this.editJobData.location ? this.editJobData.location.split(',')[1] : '';
              const location = this.editJobData.location ? this.editJobData.location.split(',')[0] : '';
              this.addJobForm.setValue({
                jobPosition: this.editJobData.jobPosition,
                jobDescription: this.editJobData.jobDescription,
                state: state.trim(),
                location: location,
                companyName: this.editJobData.companyName,
                // keywords: this.editJobData.keywords || '',
                workExperience: [this.editJobData.workExperience['years'], this.editJobData.workExperience['month']],
                expectedSalary: this.editJobData.salary,
                industry: this.editJobData.industry,
                jobCategory: this.editJobData.jobCategory,
                jobType: this.editJobData.jobType,
                email: this.editJobData.email || '',
                logo: ''
              });
              if (this.editJobData.startworkExperience) {
                this.minExperience = Number(this.editJobData.startworkExperience['years']);
                this.maxExperience = Number(this.editJobData.data.image['years']);
              }
              if (this.editJobData.stratSalary) {
                this.minSalary = Number(this.editJobData.stratSalary['years']);
                this.maxSalary = Number(this.editJobData.endSalary['years']);
              }
              this.logoFileName = this.editJobData.imageName;
              this.logoSrc = this.imgBaseUrl + this.editJobData.imageName;
            }

          }
        },
        (error) => {
          // console.log(error);
        }
      );

  }

  /**
   * Get selected file for profile image
   * @param files Selected File
   */
  getFileData(files: FileList): void {
    if (files.length > 0) {
      const fileData: File = files[0];
      this.selectedFile = fileData;
      const reader = new FileReader();
      reader.readAsDataURL(fileData);
      reader.onload = (() => {
        this.logoSrc = reader.result;
        this.logoFileName = fileData.name;
      });
    } else {
      this.removeImage();
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.logoSrc = null;
    this.logoFileName = null;
    const fileEle: any = document.getElementById('file');
    if (fileEle) {
      fileEle.value = '';
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
