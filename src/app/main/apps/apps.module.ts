import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AdminGuardService } from 'core/services/auth-guard.service';

const routes: Routes = [
    {
        path        : 'admin-dashboard',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule',
        canLoad: [AdminGuardService]
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
