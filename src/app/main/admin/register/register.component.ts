import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { confirmPasswordValidator } from './confirm-password.validator';
import { AuthenticationService } from 'core/services/authentication.service';
import { ToastrService } from 'core/services/toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';


@Component({
    selector: 'ad-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AdRegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    signUpUrl = environment.serverBaseUrl + 'admin/signUp';
    isLoading = false;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject();

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authService: AuthenticationService,
        private _toastrService: ToastrService,
        private _router: Router
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
            name: ['', Validators.required],
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

    onRegister(): void {

        if (this.registerForm.valid) {
            this.isLoading = true;
            const formValue = this.registerForm.value;
            const encryptedPswd = this._authService.encryptPassword(formValue.password);
            const params = {
                'params': {
                    'name': formValue.name,
                    'email': formValue.email,
                    'password': encryptedPswd
                }
            };
            this._authService.register(this.signUpUrl, params)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (response) => {
                        this._toastrService.displaySnackBar('Registration was successfull', 'success');
                        this._router.navigate(['/ad/login']);
                    },
                    (error: HttpErrorResponse) => {
                        this.isLoading = false;
                        this._toastrService.displaySnackBar(error.message, 'error');
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
