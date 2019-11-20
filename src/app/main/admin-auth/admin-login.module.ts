import { NgModule } from '@angular/core';
import { AdLoginModule } from './login/login.module';
import { AdRegisterModule } from './register/register.module';
import { AdForgotPasswordModule } from './forgot-password/forgot-password.module';

@NgModule({
    imports: [
        // Authentication
        AdLoginModule,
        AdRegisterModule,
        AdForgotPasswordModule
    ],
})
export class AdminLoginModule {

}
