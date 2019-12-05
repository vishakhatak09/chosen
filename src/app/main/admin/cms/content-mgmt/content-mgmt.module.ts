import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { ContentMgmtComponent } from './content-mgmt.component';
import { CmsService } from '../cms.service';
import { DragDropUploaderComponent } from 'core/components/drag-drop-uploader/drag-drop-uploader.component';

const routes: Routes = [
  {
    path: '',
    component: ContentMgmtComponent,
  }
];


@NgModule({
  declarations: [ContentMgmtComponent, DragDropUploaderComponent],
  entryComponents: [DragDropUploaderComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    FuseSharedModule
  ],
  providers: [CmsService]
})
export class ContentMgmtModule { }
