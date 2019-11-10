import { NgModule } from '@angular/core';
import { MyResumesComponent } from './my-resumes.component';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MyResumesComponent
  }
]

@NgModule({
  declarations: [MyResumesComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
  ]
})
export class MyResumesModule { }
