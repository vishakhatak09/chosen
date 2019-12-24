import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, startWith, map, switchMap } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FormControl } from '@angular/forms';
import { JobModel } from 'core/models/job.model';
import { MatDialog } from '@angular/material/dialog';
import { JobDetailComponent } from 'app/main/apps/job-detail/job-detail.component';
import { JobFilterComponent } from './job-filter/job-filter.component';
import { CommonService } from 'core/services/common.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'fuse-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class FuseSearchBarComponent implements OnInit, OnDestroy {
    collapsed: boolean;
    fuseConfig: any;
    searchBox = new FormControl();
    getJobApi = environment.serverBaseUrl + 'api/jobFilter';
    public baseUrl = environment.serverImagePath + 'job/';
    public filterResults: JobModel[] = [];

    selectedFilters;

    @Output()
    input: EventEmitter<any>;

    options: JobModel[] = [];
    filteredOptions: Observable<JobModel[]>;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private matDialog: MatDialog,
        private commonService: CommonService
    ) {
        // Set the defaults
        this.input = new EventEmitter();
        this.collapsed = true;

        // Set the private defaults
        // this._unsubscribeAll
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (config) => {
                    this.fuseConfig = config;
                }
            );

        this.initAutoComplete();
    }

    initAutoComplete() {
        this.searchBox.valueChanges
            .pipe(
                // startWith(''),
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
                    this.initAutoComplete();
                })
            );
    }

    private _filter(value: string): Observable<any> {
        let searchLocation;
        let experience;
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
        if (typeof value === 'string' && value.length > 0) {
            const filterValue = value.toLowerCase();
            params.params.keyskill = filterValue;

            // const temp = {
            //     "params": {
            //         "location": "ahmedabad",
            //         "workExperience": {
            //             "years": "5",
            //             // "month": "0"
            //         },
            //         "salary": "15",
            //         "industry": [
            //             "NAVRI", "fashion"
            //         ],
            //         "jobCategory": "companyjob",
            //         "keyskill": filterValue
            //     }
            // };

            return this.commonService.searchJob(this.getJobApi, params);
        } else if (this.selectedFilters) {
            return this.commonService.searchJob(this.getJobApi, params);
        } else {
            return of(null);
        }
    }

    clearFilter(): void {
        this.selectedFilters = null;
        this.searchBox.setValue('', { emitEvent: true });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Collapse
     */
    collapse(): void {
        // this.searchBox.reset();
        this.collapsed = true;
    }

    /**
     * Expand
     */
    expand(): void {
        this.collapsed = false;
    }

    /**
     * Search
     *
     * @param event
     */
    search(event): void {
        this.input.emit(event.target.value);
    }

    selectedJob(event, searchValue): void {
        // console.log(searchValue);
        this.searchBox.setValue(event.option.value.title, { emitEvent: false });
        this.openJobModal(event.option.value);
    }

    openJobModal(data: JobModel): void {
        this.matDialog.open(JobDetailComponent, {
            width: '1000px',
            height: 'auto',
            data: data,
            closeOnNavigation: true,
        });
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
                const element = document.getElementById('fuse-search-bar-input');
                if (element) {
                    this.searchBox.patchValue(this.searchBox.value ? this.searchBox.value : ' ', { emitEvent: true });
                    element.focus();
                }
            }
        });
    }

}
