import { NgModule } from '@angular/core';
import { ResumeComponent } from './resume.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

const routes: Routes = [
  {
      path     : '',
      component: ResumeComponent,
      children : [],
  }
];

@NgModule({
  declarations: [ResumeComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule
  ]
})
export class ResumeModule { }
