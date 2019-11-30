import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddContentComponent } from './add-content.component';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AddContentComponent
  }
];

@NgModule({
  declarations: [AddContentComponent],
  imports: [
    FuseSharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AddContentModule { }
