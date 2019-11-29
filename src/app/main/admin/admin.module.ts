import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuardService } from 'core/services/auth-guard.service';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
    {
        path        : 'dashboard',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule',
        canActivate: [AdminGuardService]
    },
    {
        path: 'userlist',
        loadChildren: './users/userlist/userlist.module#UserlistModule',
        canActivate: [AdminGuardService]
    },
    {
        path: 'user',
        loadChildren: './users/user/user.module#UserModule',
        canActivate: [AdminGuardService]
    },
    {
        path: ':userId/user',
        loadChildren: './users/user/user.module#UserModule',
        canActivate: [AdminGuardService]
    },
    {
        path: 'template-list',
        loadChildren: './upload-templates/template-list/template-list.module#TemplateListModule',
        canActivate: [AdminGuardService]
    },
    {
        path: 'admin/upload-template',
        loadChildren: './upload-templates/upload-template/upload-template.module#UploadTemplateModule',
        canActivate: [AdminGuardService]
    },
    {
        path: 'admin/:id/upload-template',
        loadChildren: './upload-templates/upload-template/upload-template.module#UploadTemplateModule',
        canActivate: [AdminGuardService]
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
