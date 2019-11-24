import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'core/services/authentication.service';
import { ToastrService } from 'core/services/toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { confirmPasswordValidator } from 'core/validators/confirm-password.validator';

@Component({
    selector: 'reset-password-2',
    templateUrl: './reset-password-2.component.html',
    styleUrls: ['./reset-password-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResetPassword2Component implements OnInit, OnDestroy {
    resetPasswordForm: FormGroup;
    resetToken: string;
    resetPswdApi = environment.serverBaseUrl + 'api/resetPassword';
    isLogin = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
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

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.resetToken = this.activatedRoute.snapshot.paramMap.get('token');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.resetPasswordForm = this._formBuilder.group({
            // name: ['', Validators.required],
            // email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    onResetPassword(): void {

        this.isLogin = true;

        const params = {
            'params': {
                'emailVerificationToken': this.resetToken,
                'password': this.resetPasswordForm.value.password,
            }
        };
        this._authService.resetPassword(this.resetPswdApi, params)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response) => {
                    this._toastrService.displaySnackBar('Your password has been reset successfully.', 'success');
                    this._router.navigate(['/pages/auth/login']);
                },
                (error: HttpErrorResponse) => {
                    this.isLogin = false;
                    this._toastrService.displaySnackBar(error.message, 'error');
                }
            );

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
