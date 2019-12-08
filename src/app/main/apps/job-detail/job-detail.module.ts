import { NgModule } from '@angular/core';
import { JobDetailComponent } from './job-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: JobDetailComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatDialogModule
  ],
  declarations: [JobDetailComponent]
})
export class JobDetailModule { }
