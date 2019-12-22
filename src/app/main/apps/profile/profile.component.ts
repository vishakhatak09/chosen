import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'core/services/authentication.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { ProfileService } from './profile.service';
import { takeUntil } from 'rxjs/operators';
import { AppConstant } from 'core/constants/app.constant';
import { ToastrService } from 'core/services/toastr.service';
import { CommonService } from 'core/services/common.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProfileComponent implements OnInit, OnDestroy {

    public profileApi = environment.serverBaseUrl + 'api/getUserProfile';
    public updateProfileApi = environment.serverBaseUrl + 'api/profileUpdate';
    public imageBaseUrl = AppConstant.GeneralConst.profileImagePath;
    public userData: any;
    public loginData: any;
    public isEdited = false;
    profileSrc;
    profileImgName: string;
    userId: string;
    defaultProfileImage: string;

    private unSubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthenticationService,
        private _profileService: ProfileService,
        private _toastrService: ToastrService,
        private commonService: CommonService
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
                        if (response.data.lastResume && response.data.lastResume.personalInfo) {
                            if (response.data.lastResume.personalInfo && response.data.lastResume.personalInfo.dateOfBirth) {
                                const dateOfBirth = this.commonService.getMomentFromDate(response.data.lastResume.personalInfo.dateOfBirth);
                                const converted = this.commonService.getMomentFormattedDate(dateOfBirth, 'DD/MM/YYY');
                                response.data.lastResume.personalInfo.dateOfBirth = converted;
                                this.userData = response.data.lastResume.personalInfo;
                            }
                        }
                        if (response.data.singleUser) {
                            this.userId = response.data.singleUser._id;
                            this.defaultProfileImage = response.data.singleUser.image;
                            this._authService.currentUserValue.image = this.defaultProfileImage;
                            this._authService.currentUserValue = this._authService.currentUserValue;
                        }
                    }
                },
                (error) => {
                    // console.log(error);
                }
            );

    }

    getFile(files: FileList): void {
        if (files.length > 0) {
            const fileData = files[0];
            const reader = new FileReader();
            reader.readAsDataURL(fileData);
            reader.onload = (() => {
                this.profileSrc = reader.result;
                this.profileImgName = fileData.name;
                this.uploadImage();
            });
        } else {
            this.profileSrc = null;
            this.profileImgName = null;
        }
    }

    uploadImage(): void {

        if (!this.profileSrc) {
            this._toastrService.displaySnackBar('Please select image to upload', 'error');
            return;
        }

        const params = {
            'params': {
                'userId': this.userId,
                'imageName': this.profileImgName,
                'photo': this.profileSrc,
            }
        };

        this._profileService.updateProfileData(this.updateProfileApi, params)
            .pipe(takeUntil(this.unSubscribeAll))
            .subscribe(
                (resp) => {
                    if (resp.code === 200) {
                        this.isEdited = !this.isEdited;
                        this.getProfileData();
                    }
                },
                (error) => {
                    this.isEdited = !this.isEdited;
                    this._toastrService.displaySnackBar('Something went wrrong, please try again', 'error');
                }
            );

    }

    ngOnDestroy(): void {
        this.unSubscribeAll.next();
        this.unSubscribeAll.complete();
    }
}
