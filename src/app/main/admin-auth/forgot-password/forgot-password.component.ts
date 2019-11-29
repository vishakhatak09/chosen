import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'core/services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'core/services/toastr.service';
import { Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'ad-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AdForgotPasswordComponent implements OnInit, OnDestroy {
    forgotPasswordForm: FormGroup;
    forgotPswdApiUrl = environment.serverBaseUrl + 'admin/forgotPassword';
    isLogin = false;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authService: AuthenticationService,
        private _router: Router,
        private _toastrService: ToastrService,
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onForgotPassword(): void {

        if (this.forgotPasswordForm.valid) {

            this.isLogin = true;
            const params = {
                'params': {
                    'email': this.forgotPasswordForm.value.email,
                }
            };
            this._authService.register(this.forgotPswdApiUrl, params)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (response) => {
                        this._toastrService.displaySnackBar('Mail has been sent to your registered email', 'success');
                        this._router.navigate(['/ad/login']);
                    },
                    (error: HttpErrorResponse) => {
                        this.isLogin = false;
                        this._toastrService.displaySnackBar(error.message, 'error');
                    }
                );

        }

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
