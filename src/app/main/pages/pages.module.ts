import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Login2Component } from './authentication/login-2/login-2.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ForgotPassword2Component } from './authentication/forgot-password-2/forgot-password-2.component';
import { Register2Component } from './authentication/register-2/register-2.component';
import { ResetPassword2Component } from './authentication/reset-password-2/reset-password-2.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { ForgotPasswordModule } from 'app/main/pages/authentication/forgot-password/forgot-password.module';
// import { LockModule } from 'app/main/pages/authentication/lock/lock.module';
// import { LoginModule } from 'app/main/pages/authentication/login/login.module';
// import { MailConfirmModule } from 'app/main/pages/authentication/mail-confirm/mail-confirm.module';
// import { RegisterModule } from 'app/main/pages/authentication/register/register.module';
// import { ResetPasswordModule } from 'app/main/pages/authentication/reset-password/reset-password.module';
// import { ForgotPassword2Module } from 'app/main/pages/authentication/forgot-password-2/forgot-password-2.module';
// import { Login2Module } from 'app/main/pages/authentication/login-2/login-2.module';
// import { Register2Module } from 'app/main/pages/authentication/register-2/register-2.module';
// import { ResetPassword2Module } from 'app/main/pages/authentication/reset-password-2/reset-password-2.module';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { environment } from 'environments/environment';

const routes: Routes = [
    {
        path: 'login',
        component: Login2Component
    },
    {
        path: 'forgot-password',
        component: ForgotPassword2Component
    },
    {
        path: 'register',
        component: Register2Component
    },
    {
        path: 'reset-password/:token',
        component: ResetPassword2Component
    }
];

@NgModule({
    declarations: [
        Login2Component,
        ResetPassword2Component,
        ForgotPassword2Component,
        Register2Component
    ],
    imports: [
        // Authentication
        // LoginModule,
        // RegisterModule,
        // ForgotPasswordModule,
        // ResetPasswordModule,
        // LockModule,
        // MailConfirmModule,

        // Used
        // Login2Module,
        // Register2Module,
        // ForgotPassword2Module,
        // ResetPassword2Module,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FlexLayoutModule,

        RecaptchaModule,
        RecaptchaFormsModule,
        // FuseSharedModule
    ],
    providers: [
        // {
        //     provide: RECAPTCHA_SETTINGS,
        //     useValue: {
        //         siteKey: environment.recaptchaSiteKey,
        //     } as RecaptchaSettings,
        // }
    ]
})
export class PagesModule {

}
