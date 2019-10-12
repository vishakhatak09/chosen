import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    // {
    //     path        : 'dashboards/analytics',
    //     loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
    // },
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
