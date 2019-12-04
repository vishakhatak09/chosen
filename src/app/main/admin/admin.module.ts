import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
    {
        path        : 'dashboard',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule',
    },
    {
        path: 'userlist',
        loadChildren: './users/userlist/userlist.module#UserlistModule',
    },
    {
        path: 'user',
        loadChildren: './users/user/user.module#UserModule',
    },
    {
        path: ':userId/user',
        loadChildren: './users/user/user.module#UserModule',
    },
    {
        path: 'template-list',
        loadChildren: './upload-templates/template-list/template-list.module#TemplateListModule',
    },
    {
        path: 'upload-template',
        loadChildren: './upload-templates/upload-template/upload-template.module#UploadTemplateModule',
    },
    {
        path: ':id/upload-template',
        loadChildren: './upload-templates/upload-template/upload-template.module#UploadTemplateModule',
    },
    {
        path: 'job-mgmt',
        loadChildren: './job-mgmt/job-mgmt.module#JobMgmtModule',
    },
    {
        path: 'add-job',
        loadChildren: './add-job/add-job.module#AddJobModule'
    },
    {
        path: 'content-mgmt',
        loadChildren: './cms/content-mgmt/content-mgmt.module#ContentMgmtModule'
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [FuseSharedModule],
    declarations: [],
})
export class AdminModule { }
