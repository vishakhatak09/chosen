import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from 'core/services/authentication.service';
import { Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'core/services/toastr.service';
import { EncryptDecryptService } from 'core/services/encrypt-decrypt.service';

@Component({
    selector: 'ad-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AdLoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    isLoading = false;

    adminLoginUrl = environment.serverBaseUrl + 'admin/login';

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
        private _authService: AuthenticationService,
        private _toastrService: ToastrService,
        private _encryptDecryptService: EncryptDecryptService
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

        // Redirect if already login
        // const currentUserValue = this._authService.currentUserValue;
        // if (currentUserValue && currentUserValue.type && currentUserValue.type === 'admin') {
        //     this._router.navigate(['/ad/dashboard']);
        // } else {
        //     this._router.navigate(['/user/templates']);
        // }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }


    /**
     * Admin Login
     */
    onAdminLogin(): void {

        if (this.loginForm.valid) {
            this.isLoading = true;
            const formValue = this.loginForm.value;
            const encryptedPswd = this._authService.encryptPassword(formValue.password);
            const params = {
                'params': {
                    'email': formValue.email,
                    'password': encryptedPswd
                }
            };
            this._authService.login(this.adminLoginUrl, params)
                .pipe(takeUntil(this._unSubscribeAll))
                .subscribe(
                    (response) => {
                        // this.isLoading = false;
                        this._router.navigate(['/ad/dashboard']);
                    },
                    (error: HttpErrorResponse) => {
                        this.isLoading = false;
                        this._toastrService.displaySnackBar(error.message, 'error');
                    }
                );
        }

    }

    ngOnDestroy(): void {
        this._unSubscribeAll.next();
        this._unSubscribeAll.complete();
    }
}
