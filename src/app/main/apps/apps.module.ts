import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AdminGuardService } from 'core/services/auth-guard.service';

const routes: Routes = [
    {
        path        : 'admin-dashboard',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule',
        canActivate: [AdminGuardService]
    },
    // {
    //     path        : 'dashboards/project',
    //     loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
    // },
    // {
    //     path: 'scrumboard',
    //     loadChildren: './scrumboard/scrumboard.module#ScrumboardModule'
    // },
    {
        path: 'resume',
        loadChildren: './resume/resume.module#ResumeModule'
    },
    {
        path: 'resumebuilder',
        loadChildren: './resumebuilder/resumebuilder.module#ResumebuilderModule'
    },
    {
        path: 'templates',
        loadChildren: './templates/templates.module#TemplatesModule',
    },
    {
        path: 'my-resumes',
        loadChildren: './my-resumes/my-resumes.module#MyResumesModule'
    },
    {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfileModule'
    },
    {
        path: 'admin/userlist',
        loadChildren: './users/userlist/userlist.module#UserlistModule',
        canActivate: [AdminGuardService]
    },
    {
        path: 'admin/user',
        loadChildren: './users/user/user.module#UserModule',
        canActivate: [AdminGuardService]
    },
    {
        path: 'admin/:userId/user',
        loadChildren: './users/user/user.module#UserModule',
        canActivate: [AdminGuardService]
    },
    {
        path: 'admin/template-list',
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
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule
    ],
    declarations: []
})
export class AppsModule {
}
