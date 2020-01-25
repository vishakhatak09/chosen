import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AppConstant } from 'core/constants/app.constant';
import { JobCategory, JobIndustry } from 'core/constants/job-constant';
import { CityModel } from 'core/models/job.model';
import { CommonService } from 'core/services/common.service';
import { environment } from 'environments/environment';
import { Options } from 'ng5-slider';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import 'tinymce/tinymce.min.js';
declare var tinymce: any;

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
  tinyEditorConfig = {};

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
    this.setupTinyMce();
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
        'years': String(formValues.workExperience[0]),
        'month': '0'
      };
      const endWorkExp = {
        'years': String(formValues.workExperience[1]),
        'month': '0'
      };
      const params: any = {
        'params': {
          'jobPosition': formValues.jobPosition,
          'jobDescription': formValues.jobDescription,
          'companyName': formValues.companyName,
          'jobType': formValues.jobType,
          'location': formValues.location + ', ' + formValues.state,
          'startworkExperience': startWorkExp,
          'endworkExperience': endWorkExp,
          'startSalary': String(formValues.expectedSalary[0]),
          'endSalary': String(formValues.expectedSalary[1]),
          'industry': formValues.industry,
          'jobCategory': formValues.jobCategory,
          'email': formValues.email,
          // 'imageName': this.selectedFile ? this.logoFileName : '',
          // 'photo': this.selectedFile ? this.logoSrc : '',
        }
      };
      if (this.selectedFile) {
        params.params.imageName = this.logoFileName;
        params.params.photo = this.logoSrc;
      }
      if (this.jobId) {
        params.params.jobId = this.jobId;
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
            if (this.editJobData) {
              const state = this.editJobData.location ? this.editJobData.location.split(',')[1] : '';
              const location = this.editJobData.location ? this.editJobData.location.split(',')[0] : '';
              this.addJobForm.setValue({
                jobPosition: this.editJobData.jobPosition,
                jobDescription: this.editJobData.jobDescription,
                state: state ? state.trim() : '',
                location: location,
                companyName: this.editJobData.companyName,
                // keywords: this.editJobData.keywords || '',
                workExperience: [this.editJobData.startworkExperience['years'], this.editJobData.endworkExperience['years']],
                expectedSalary: this.editJobData.startSalary && this.editJobData.endSalary ?
                  [Number(this.editJobData.startSalary), Number(this.editJobData.endSalary)] : [0, 0],
                industry: this.editJobData.industry,
                jobCategory: this.editJobData.jobCategory,
                jobType: this.editJobData.jobType,
                email: this.editJobData.email || '',
                logo: ''
              });
              if (this.editJobData.startworkExperience) {
                this.minExperience = Number(this.editJobData.startworkExperience['years']);
                this.maxExperience = Number(this.editJobData.endworkExperience['years']);
              }
              if (this.editJobData.startSalary) {
                this.minSalary = Number(this.editJobData.startSalary);
                this.maxSalary = Number(this.editJobData.endSalary);
              }
              this.logoFileName = this.editJobData.image;
              this.logoSrc = this.imgBaseUrl + this.editJobData.image;
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

  private setupTinyMce(): void {
    // tinymce.baseURL = 'assets'; // Need to display proper editor with its its folder in assets folder
    tinymce.baseURL = environment.tinyMceBaseUrl; // Need to display proper editor with its its folder in assets folder
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
