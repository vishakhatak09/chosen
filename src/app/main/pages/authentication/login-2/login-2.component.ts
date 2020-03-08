import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { ToastrService } from 'core/services/toastr.service';
import { AuthenticationService } from 'core/services/authentication.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { EncryptDecryptService } from 'core/services/encrypt-decrypt.service';
import { AppConstant } from 'core/constants/app.constant';

@Component({
    selector: 'login-2',
    templateUrl: './login-2.component.html',
    styleUrls: ['./login-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class Login2Component implements OnInit, OnDestroy {
    loginForm: FormGroup;
    loginUrl = environment.serverBaseUrl + 'api/login';
    public isLoading = false;
    // rememeberMe = false;
    rememeberedData: string;
    // response;

    private _unSubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _toastrService: ToastrService,
        private authService: AuthenticationService,
        private encryptDecryptService: EncryptDecryptService
    ) {

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // // Redirect if already login
        const currentUserValue = this.authService.currentUserValue;
        if (currentUserValue && currentUserValue.type && currentUserValue.type === 'user') {
            this._router.navigate(['/user/templates']);
        }
        //  else {
        //     this._router.navigate(['/user/templates']);
        // }
        const data: string = this.encryptDecryptService.getDecryptedLocalStorage(AppConstant.AuthRememberKey);
        if (data !== undefined && data !== null && data.includes(AppConstant.AuthRememberSeperator)) {
            // this.rememeberMe = true;
            this.rememeberedData = data;
        } else {
            this.encryptDecryptService.removeEncryptedLocalStorage(AppConstant.AuthRememberKey);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        if (this.rememeberedData) {
            const email = this.rememeberedData.split(AppConstant.AuthRememberSeperator)[0];
            const pswd = this.rememeberedData.split(AppConstant.AuthRememberSeperator)[1];
            this.loginForm = this._formBuilder.group({
                email: [email, [Validators.required, Validators.email]],
                password: [pswd, [Validators.required, Validators.minLength(6)]],
                rememeberMe: [true],
                recaptchaReactive: [null, Validators.required]
            });
        } else {
            this.loginForm = this._formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(6)]],
                rememeberMe: [false],
                recaptchaReactive: [null, Validators.required]
            });
        }
    }

    /**
     * Login
     */
    login(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const formValue = this.loginForm.value;
            const encryptedPswd = this.authService.encryptPassword(formValue.password);
            const params = {
                'params': {
                    'email': formValue.email,
                    'password': encryptedPswd
                }
            };
            this.authService.login(this.loginUrl, params)
                .pipe(takeUntil(this._unSubscribeAll))
                .subscribe(
                    (response) => {
                        if (this.loginForm.get('rememeberMe').value === true) {
                            const cookie = formValue.email + AppConstant.AuthRememberSeperator + formValue.password;
                            this.encryptDecryptService.setEncryptedLocalStorage(AppConstant.AuthRememberKey, cookie);
                        } else {
                            this.encryptDecryptService.removeEncryptedLocalStorage(AppConstant.AuthRememberKey);
                        }
                        // this._toastrService.displaySnackBar('Login successfull', 'success');
                        // this.isLoading = false;
                        this._router.navigate(['/user/templates']);
                    },
                    (error: HttpErrorResponse) => {
                        this.isLoading = false;
                        this._toastrService.displaySnackBar(error.message, 'error');
                    }
                );
        }

    }

    /**
     * On Destroy
     */
    ngOnDestroy(): void {
        this._unSubscribeAll.next();
        this._unSubscribeAll.complete();
    }
}
