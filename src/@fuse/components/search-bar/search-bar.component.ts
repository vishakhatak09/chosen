import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FormControl } from '@angular/forms';
import { JobModel } from 'core/models/job.model';
import { MatDialog } from '@angular/material/dialog';
import { JobDetailComponent } from 'app/main/apps/job-detail/job-detail.component';

@Component({
    selector: 'fuse-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class FuseSearchBarComponent implements OnInit, OnDestroy {
    collapsed: boolean;
    fuseConfig: any;
    searchBox = new FormControl();

    @Output()
    input: EventEmitter<any>;

    options: JobModel[] = [
        {
            logo: 'assets/images/logos/fuse.svg',
            jobPosition: 'Api Developer',
            jobDescription: 'Full time backend developer with a minimum experience of 1-2 years in core & any framework',
            state: 'Gujarat',
            location: 'Ahmedabad',
            companyName: 'FORRET INDIA PRIVATE LIMITED',
            keywords: 'API Developer Jobs in Pune, India',
            workExperience: '1 - 2',
            expectedSalary: '20',
            industry: 'IT',
            jobCategory: 'IT Software - All Jobs',
            jobType: 'All Jobs',
        }
    ];
    filteredOptions: Observable<JobModel[]>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private matDialog: MatDialog
    ) {
        // Set the defaults
        this.input = new EventEmitter();
        this.collapsed = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
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

        this.filteredOptions = this.searchBox.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
        // this.filteredOptions.subscribe(val => console.log(val));
    }

    private _filter(value: string): JobModel[] {
        if (typeof value === 'string') {
            const filterValue = value.toLowerCase();

            return this.options.filter(option => option.jobDescription.toLowerCase().includes(filterValue));
        }
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
        this.searchBox.reset();
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

    selectedJob(event): void {
        this.searchBox.setValue(event.option.value.title, { emitEvent: false });
        this.openJobModal(event.option.value);
    }

    openJobModal(data: JobModel): void {
        this.matDialog.open(JobDetailComponent, {
            width: '1000px',
            height: 'auto',
            data: data
        });
    }

}
