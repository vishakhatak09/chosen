import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { AuthenticationService } from 'core/services/authentication.service';
import { AppConstant } from 'core/constants/app.constant';
import { FormControl } from '@angular/forms';
import { environment } from 'environments/environment';
import { JobModel } from 'core/models/job.model';
import { CommonService } from 'core/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { JobFilterComponent } from '@fuse/components/search-bar/job-filter/job-filter.component';
import { JobDetailComponent } from 'app/main/apps/job-detail/job-detail.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    isLoggedIn = false;
    userEmail: string;
    userData: any;

    public imageBaseUrl = AppConstant.GeneralConst.profileImagePath;

    searchBox = new FormControl();
    getJobApi = environment.serverBaseUrl + 'api/jobFilter';
    public baseUrl = environment.serverImagePath + 'job/';
    public filterResults: JobModel[] = [];

    selectedFilters;
    options: JobModel[] = [];
    filteredOptions: Observable<JobModel[]>;
    previousSearch = '';

    // Private
    private _unsubscribeAll: Subject<any>; 

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private authService: AuthenticationService,
        private cdRef: ChangeDetectorRef,
        private matDialog: MatDialog,
        private commonService: CommonService,
        iconRegistry: MatIconRegistry, sanitizer: DomSanitizer
    ) {
        iconRegistry.addSvgIcon(
            'job-search',
            sanitizer.bypassSecurityTrustResourceUrl('assets/img/job-search.svg'));

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
        ];

        this.navigation = navigation;

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
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });

        this.userData = this.authService.currentUserValue;
        if (this.userData) {
            this.isLoggedIn = true;
            this.userEmail = this.userData.email || '';
            this.cdRef.detectChanges();
            if (this.userData.type && this.userData.type === 'admin') {
                this.authService.setAdminNavigation();
            }
        }
        this.initAutoComplete();
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
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        // console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    selectedJob(event): void {
        // console.log(this.previousSearch);
        this.searchBox.setValue(this.previousSearch, { emitEvent: false });
        this.openJobModal(event.option.value);
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
                        this.searchBox.patchValue(this.searchBox.value ? this.previousSearch : ' ', { emitEvent: true });
                        element.focus();
                    }
                } else {
                    this.previousSearch = '';
                    this.selectedFilters = null;
                    this.searchBox.setValue('', { emitEvent: false });
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
                const element = document.getElementById('fuse-search-bar-input');
                if (element) {
                    this.searchBox.patchValue(this.searchBox.value ? this.searchBox.value : ' ', { emitEvent: true });
                    element.focus();
                }
            }
        });
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
        if (typeof value === 'string' && value.length > 0) {
            const filterValue = value.toLowerCase();
            params.params.keyskill = filterValue;

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
     * Logout
     */
    logout(): void {
        this.authService.logout();
    }
}
