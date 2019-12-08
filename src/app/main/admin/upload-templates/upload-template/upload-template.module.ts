import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { UploadTemplateComponent } from './upload-template.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { UploadTemplateService } from './upload-template.service';
import {
  DragDropUploaderComponent
} from 'core/components/drag-drop-uploader/drag-drop-uploader.component';

const routes: Routes = [
  {
    path: '',
    component: UploadTemplateComponent,
  }
];

@NgModule({
  declarations: [UploadTemplateComponent, DragDropUploaderComponent],
  entryComponents: [DragDropUploaderComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    EditorModule
  ],
  providers: [UploadTemplateService]
})
export class UploadTemplateModule { }
