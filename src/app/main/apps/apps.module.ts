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
        path: 'resume',
        loadChildren: './resume/resume.module#ResumeModule'
    },
    {
        path: ':id/resumebuilder',
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
