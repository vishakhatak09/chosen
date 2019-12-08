import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'core/services/authentication.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { ProfileService } from './profile.service';
import { takeUntil } from 'rxjs/operators';
import { AppConstant } from 'core/constants/app.constant';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProfileComponent implements OnInit, OnDestroy {

    public profileApi = environment.serverBaseUrl + 'api/resume/profileResumeList';
    public imageBaseUrl = AppConstant.GeneralConst.UserImagePath;
    public userData: any;
    public loginData: any;
    public isEdited = false;

    private unSubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthenticationService,
        private _profileService: ProfileService
    ) {
        this.loginData = this._authService.currentUserValue;
    }

    ngOnInit(): void {
        this.getProfileData();
    }

    getProfileData(): void {

        this._profileService.getProfileData(this.profileApi)
            .pipe(takeUntil(this.unSubscribeAll))
            .subscribe(
                (response) => {
                    // console.log('response', response);
                    if (response.code === 200 && response.data) {
                        if (response.data.length > 0) {
                            this.userData = response.data[response.data.length - 1].personalInfo || null;
                        }

                    }
                },
                (error) => {
                    // console.log(error);
                }
            );

    }

    getFile(files: FileList): void {
        // console.log(files);
    }

    ngOnDestroy(): void {
        this.unSubscribeAll.next();
        this.unSubscribeAll.complete();
    }
}
