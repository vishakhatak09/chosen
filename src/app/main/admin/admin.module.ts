import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AdminGuardService } from 'core/services/auth-guard.service';

const routes: Routes = [
    // {
    //     path: 'project',
    //     loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
    // },
    {
        path: 'login',
        loadChildren: './login/login.module#AdLoginModule'
    },
    {
        path: 'register',
        loadChildren: './register/register.module#AdRegisterModule'
    },
    {
        path: 'forgot-password',
        loadChildren: './forgot-password/forgot-password.module#AdForgotPasswordModule'
    },
    {
        path: 'reset-password/:token',
        loadChildren: './reset-password/reset-password.module#AdResetPasswordModule'
    },
    {
        path        : 'dashboard',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule',
        canLoad: [AdminGuardService]
    },
    {
        path: 'userlist',
        loadChildren: './users/userlist/userlist.module#UserlistModule',
        canLoad: [AdminGuardService]
    },
    {
        path: 'user',
        loadChildren: './users/user/user.module#UserModule',
        canLoad: [AdminGuardService]
    },
    {
        path: ':userId/user',
        loadChildren: './users/user/user.module#UserModule',
        canLoad: [AdminGuardService]
    },
    {
        path: 'template-list',
        loadChildren: './upload-templates/template-list/template-list.module#TemplateListModule',
        canLoad: [AdminGuardService]
    },
    {
        path: 'upload-template',
        loadChildren: './upload-templates/upload-template/upload-template.module#UploadTemplateModule',
        canLoad: [AdminGuardService]
    },
    {
        path: ':id/upload-template',
        loadChildren: './upload-templates/upload-template/upload-template.module#UploadTemplateModule',
        canLoad: [AdminGuardService]
    },
    {
        path: 'job-mgmt',
        loadChildren: './job-mgmt/job-mgmt.module#JobMgmtModule',
        canLoad: [AdminGuardService]
    },
    {
        path: 'add-job',
        loadChildren: './add-job/add-job.module#AddJobModule',
        canLoad: [AdminGuardService]
    },
    {
        path: ':jobId/add-job',
        loadChildren: './add-job/add-job.module#AddJobModule',
        canLoad: [AdminGuardService]
    },
    {
        path: 'content-mgmt',
        loadChildren: './cms/content-mgmt/content-mgmt.module#ContentMgmtModule',
        canLoad: [AdminGuardService]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule
    ],
    exports: [FuseSharedModule],
    declarations: [],
    entryComponents: [],
})
export class AdminModule { }
