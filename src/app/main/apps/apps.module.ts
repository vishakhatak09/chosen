import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'admin-dashboard',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
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
    },
    {
        path: 'user',
        loadChildren: './users/user/user.module#UserModule',
    },
    {
        path: ':userId/user',
        loadChildren: './users/user/user.module#UserModule',
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
