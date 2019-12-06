import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FormControl } from '@angular/forms';
import { JobModel } from 'core/models/job.model';

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
            title: 'API Developer Jobs in Pune, India',
            description: 'via Wisdom Jobs India',
            company: 'FORRET INDIA PRIVATE LIMITED',
            location: 'Ahmedabad, Gujarat',
            time: '11 hours ago',
            jobType: 'Full-Time',
            logo: 'assets/icons/template-icons/envelope.svg'
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
        private _fuseConfigService: FuseConfigService
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

            return this.options.filter(option => option.title.toLowerCase().includes(filterValue));
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

}
