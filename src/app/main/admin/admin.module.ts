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
        loadChildren: () => import('./login/login.module').then(m => m.AdLoginModule)
    },
    // { // hide register for admin
    //     path: 'register',
    //     loadChildren: './register/register.module#AdRegisterModule'
    // },
    {
        path: 'forgot-password',
        loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.AdForgotPasswordModule)
    },
    {
        path: 'reset-password/:token',
        loadChildren: () => import('./reset-password/reset-password.module').then(m => m.AdResetPasswordModule)
    },
    {
        path        : 'dashboard',
        loadChildren: () => import('./dashboards/analytics/analytics.module').then(m => m.AnalyticsDashboardModule),
        canLoad: [AdminGuardService]
    },
    {
        path: 'userlist',
        loadChildren: () => import('./users/userlist/userlist.module').then(m => m.UserlistModule),
        canLoad: [AdminGuardService]
    },
    {
        path: 'user',
        loadChildren: () => import('./users/user/user.module').then(m => m.UserModule),
        canLoad: [AdminGuardService]
    },
    {
        path: ':userId/user',
        loadChildren: () => import('./users/user/user.module').then(m => m.UserModule),
        canLoad: [AdminGuardService]
    },
    {
        path: 'template-list',
        loadChildren: () => import('./upload-templates/template-list/template-list.module').then(m => m.TemplateListModule),
        canLoad: [AdminGuardService]
    },
    {
        path: 'upload-template',
        loadChildren: () => import('./upload-templates/upload-template/upload-template.module').then(m => m.UploadTemplateModule),
        canLoad: [AdminGuardService]
    },
    {
        path: ':id/upload-template',
        loadChildren: () => import('./upload-templates/upload-template/upload-template.module').then(m => m.UploadTemplateModule),
        canLoad: [AdminGuardService]
    },
    {
        path: 'job-mgmt',
        loadChildren: () => import('./job-mgmt/job-mgmt.module').then(m => m.JobMgmtModule),
        canLoad: [AdminGuardService]
    },
    {
        path: 'add-job',
        loadChildren: () => import('./add-job/add-job.module').then(m => m.AddJobModule),
        canLoad: [AdminGuardService]
    },
    {
        path: ':jobId/add-job',
        loadChildren: () => import('./add-job/add-job.module').then(m => m.AddJobModule),
        canLoad: [AdminGuardService]
    },
    {
        path: 'content-mgmt',
        loadChildren: () => import('./cms/content-mgmt/content-mgmt.module').then(m => m.ContentMgmtModule),
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
