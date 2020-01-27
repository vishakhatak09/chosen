import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { JobEmailComponent } from './job-email.component';

const routes: Routes = [
  {
    path: '',
    component: JobEmailComponent
  }
];

@NgModule({
  declarations: [JobEmailComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    EditorModule,
  ]
})
export class JobEmailModule { }
