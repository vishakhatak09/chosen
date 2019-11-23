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
import { AppConstant } from 'core/constants/app.constant';
import { HttpErrorResponse } from '@angular/common/http';

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
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    /**
     * Login
     */
    login(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const formValue = this.loginForm.value;
            const params = {
                'params': {
                    'email': formValue.email,
                    'password': formValue.password
                }
            };
            this.authService.login(this.loginUrl, params)
                .pipe(takeUntil(this._unSubscribeAll))
                .subscribe(
                    (response) => {
                        this._toastrService.displaySnackBar('Login successfull', 'success');
                        this.isLoading = false;
                        this._router.navigate(['/apps/templates']);
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
