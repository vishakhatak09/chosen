import { NgModule } from '@angular/core';
import { MyResumesComponent } from './my-resumes.component';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MyResumesService } from './my-resumes.service';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: MyResumesComponent
  }
];

@NgModule({
  declarations: [MyResumesComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatDialogModule
  ],
  providers: [MyResumesService]
})
export class MyResumesModule { }
