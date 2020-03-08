import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JobFilterComponent } from '@fuse/components/search-bar/job-filter/job-filter.component';
import { JobModel } from 'core/models/job.model';
import { CommonService } from 'core/services/common.service';
import { environment } from 'environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil, startWith } from 'rxjs/operators';
import { JobDetailComponent } from '../job-detail/job-detail.component';
import { Router } from '@angular/router';
import { ResumePreviewComponent } from '../resume-preview/resume-preview.component';
import { AuthenticationService } from 'core/services/authentication.service';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss']
})
export class JobSearchComponent implements OnInit, OnDestroy {

  searchBox = new FormControl();
  getJobApi = environment.serverBaseUrl + 'api/jobFilter';
  getAllJobApi = environment.serverBaseUrl + 'api/jobList';
  public baseUrl = environment.serverImagePath + 'job/';
  public filterResults: JobModel[] = [];

  selectedFilters: any;
  options: JobModel[] = [];
  filteredOptions: Observable<JobModel[]>;
  previousSearch = '';
  jobResumeData;

  // Private
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private commonService: CommonService,
    private matDialog: MatDialog,
    private router: Router,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.initAutoComplete();
    if (this.auth.currentUserValue) {
      // console.log(this.auth.currentUserValue);
      const resumeData = {
        personalInfo: {
          email: this.auth.currentUserValue.email,
          firstName: this.auth.currentUserValue.name
        }
      };
      this.jobResumeData = resumeData;
    }
  }

  initAutoComplete(initialValue = '') {
    this.searchBox.valueChanges
      .pipe(
        startWith(initialValue),
        switchMap(value => this._filter(value)),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(
        (response) => {
          if (response && response.code === 200) {
            this.filterResults = response.data;
          } else {
            this.filterResults = [];
          }
        },
        ((error) => {
          this.filterResults = [];
          this.initAutoComplete(null);
        })
      );
  }

  private _filter(value: string): Observable<any> {
    let searchLocation: string;
    let experience: { 'years': string; 'month': string; };
    if (typeof value === 'string') {
      this.previousSearch = value;
    }
    if (this.selectedFilters && this.selectedFilters.locationState) {
      if (this.selectedFilters.location) {
        searchLocation = this.selectedFilters.location + ', ' + this.selectedFilters.locationState;
      } else {
        searchLocation = this.selectedFilters.locationState;
      }
    }
    if (this.selectedFilters && this.selectedFilters.workExperience) {
      experience = {
        'years': String(this.selectedFilters.workExperience),
        'month': '0'
      };
    }
    const params: any = {
      params: {}
    };
    if (this.selectedFilters) {
      if (searchLocation) {
        params.params.location = searchLocation;
      }
      if (this.selectedFilters.workExperience) {
        params.params.workExperience = experience;
      }
      if (this.selectedFilters.salary) {
        params.params.salary = String(this.selectedFilters.salary);
      }
      if (this.selectedFilters.industry) {
        params.params.industry = this.selectedFilters.industry;
      }
      if (this.selectedFilters.jobCategory) {
        params.params.jobCategory = this.selectedFilters.jobCategory;
      }
    }

    if (typeof value === 'string') {
      if (!this.selectedFilters && value.trim().length === 0) {
        return this.getAllJobs();
      } if (typeof value === 'string' && value.length > 0) {
        const filterValue = value.toLowerCase();
        params.params.keyskill = filterValue;
        return this.commonService.searchJob(this.getJobApi, params);
      } else if (this.selectedFilters) {
        return this.commonService.searchJob(this.getJobApi, params);
      } else {
        return this.getAllJobs();
      }
    } else {
      return of(null);
    }

  }

  getAllJobs() {
    return this.commonService.searchAllJob(this.getAllJobApi);
  }

  clearFilter(): void {
    this.selectedFilters = null;
    this.searchBox.setValue('', { emitEvent: true });
  }

  selectedJob(event): void {
    // console.log(this.previousSearch);
    this.searchBox.setValue(this.previousSearch, { emitEvent: false });
    // this.openJobModal(event.option.value);
    this.openJobModal(event);
  }

  openJobModal(data: JobModel): void {
    const dialogRef = this.matDialog.open(JobDetailComponent, {
      width: '1000px',
      height: 'auto',
      data: data,
      closeOnNavigation: true,
      restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(
      (applyJob: boolean) => {
        if (!applyJob) {
          const element = document.getElementById('fuse-search-bar-input');
          if (element) {
            // this.filterResults = this.filterResults.slice();
            // this.searchBox.patchValue(this.previousSearch, { emitEvent: true });
            // element.focus();
          }
        } else {
          // this.previousSearch = '';
          // this.selectedFilters = null;
          // this.searchBox.setValue('', { emitEvent: false });
          this.openJobEmailDialog(data);
        }
      }
    );
  }

  openFilterModal(): void {
    const dialogRef = this.matDialog.open(JobFilterComponent, {
      width: '1000px',
      height: 'auto',
      restoreFocus: false,
      disableClose: true,
      data: this.selectedFilters,
      closeOnNavigation: true
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.selectedFilters = response;
        // const element = document.getElementById('fuse-search-bar-input');
        // if (element) {
          this.searchBox.patchValue(this.previousSearch, { emitEvent: true });
          // element.focus();
        // }
      }
    });
  }

  openJobEmailDialog(data: JobModel): void {
    const dialogRef = this.matDialog.open(ResumePreviewComponent,
      {
        width: '1000px',
        height: 'auto',
        closeOnNavigation: true,
        restoreFocus: false
      }
    );
    dialogRef.afterClosed().subscribe((response: boolean) => {
      if (response === true) {
        // chosen
        this.router.navigate(['/user/my-resumes/choose'],
          {
            state: {
              'jobDetail': data
            }
          }
        );
      } else if ( response === false ) {
        this.router.navigate(['/user/job-email'], {
          state: {
            jobData: {
              job: data,
              resume: this.jobResumeData
            }
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
