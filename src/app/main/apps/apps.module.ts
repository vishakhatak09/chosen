import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
    // {
    //     path        : 'dashboards/project',
    //     loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
    // },
    // {
    //     path: 'scrumboard',
    //     loadChildren: './scrumboard/scrumboard.module#ScrumboardModule'
    // },
    {
        path: ':templateId/resumebuilder',
        loadChildren: './resumebuilder/resumebuilder.module#ResumebuilderModule'
    },
    {
        path: ':templateId/resumebuilder/:resumeId',
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
        path: 'my-resumes/:choose',
        loadChildren: './my-resumes/my-resumes.module#MyResumesModule'
    },
    {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfileModule'
    },
    {
        path: 'job-search',
        loadChildren: './job-search/job-search.module#JobSearchModule'
    },
    {
        path: '**',
        redirectTo: 'templates',
        pathMatch: 'full',
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
