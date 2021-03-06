import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthenticationService } from 'core/services/authentication.service';
import { ToastrService } from 'core/services/toastr.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { confirmPasswordValidator } from 'core/validators/confirm-password.validator';
import { AppConstant } from 'core/constants/app.constant';


@Component({
    selector: 'register-2',
    templateUrl: './register-2.component.html',
    styleUrls: ['./register-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class Register2Component implements OnInit, OnDestroy {
    registerForm: FormGroup;
    signUpUrl = environment.serverBaseUrl + 'api/signUp';
    isLoading = false;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject();

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
        this.registerForm = this._formBuilder.group({
            name           : ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            agreeTerms: [null, [Validators.required]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    onSubmit(): void {

        if (this.registerForm.valid) {
            this.isLoading = true;
            const formValue = this.registerForm.value;
            const pswd = this._authService.encryptPassword(this.registerForm.value.password);
            const params = {
                'params': {
                    'name': formValue.name,
                    'email': formValue.email,
                    'password': pswd
                }
            };
            this._authService.register(this.signUpUrl, params)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (response) => {
                        this._toastrService.displaySnackBar('Registration was successfull', 'success');
                        this._router.navigate(['/auth/login']);
                    },
                    (error: any) => {
                        this.isLoading = false;
                        if (error && error.code === 409) {
                            this._toastrService.displaySnackBar('This user already exists. Please try with another email.', 'error');
                        } else {
                            this._toastrService.displaySnackBar(
                                error.message || AppConstant.ConstantMsgs.somethingWentWrong,
                                'error'
                            );
                        }
                    }
                );
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
}
