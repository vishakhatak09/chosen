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
        loadChildren: () => import('./resumebuilder/resumebuilder.module').then(m => m.ResumebuilderModule)
    },
    {
        path: ':templateId/resumebuilder/:resumeId',
        loadChildren: () => import('./resumebuilder/resumebuilder.module').then(m => m.ResumebuilderModule)
    },
    {
        path: 'templates',
        loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule)
    },
    {
        path: 'my-resumes',
        loadChildren: () => import('./my-resumes/my-resumes.module').then(m => m.MyResumesModule)
    },
    {
        path: 'my-resumes/:choose',
        loadChildren: () => import('./my-resumes/my-resumes.module').then(m => m.MyResumesModule)
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
    },
    {
        path: 'job-search',
        loadChildren: () => import('./job-search/job-search.module').then(m => m.JobSearchModule)
    },
    {
        path: 'job-email',
        loadChildren: () => import('./job-email/job-email.module').then(m => m.JobEmailModule)
    },
    // {
    //     path: 'preview',
    //     loadChildren: './resume-preview/resume-preview.module#ResumePreviewModule'
    // },
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
