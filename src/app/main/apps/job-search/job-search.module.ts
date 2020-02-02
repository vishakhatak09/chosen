import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { JobSearchComponent } from './job-search.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ResumePreviewComponent } from '../resume-preview/resume-preview.component';

const routes: Routes = [
  {
    path: '',
    component: JobSearchComponent
  }
];

@NgModule({
  declarations: [JobSearchComponent, ResumePreviewComponent],
  entryComponents: [ResumePreviewComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatTooltipModule,
    MatDialogModule
  ]
})
export class JobSearchModule { }
