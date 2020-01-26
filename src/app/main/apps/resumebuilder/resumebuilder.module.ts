import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { ResumebuilderComponent } from './resumebuilder.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { BarRatingModule } from 'ngx-bar-rating';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResumeTemplateComponent } from './resume-template/resumetemplate.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { ResumeBuilderService } from './resumebuilder.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AddWorkComponent } from './add-work/add-work.component';
import { AddEducationComponent } from './add-education/add-education.component';
import { FuseMaterialColorPickerModule } from '@fuse/components';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
// import { Template1Component } from 'core/components/template1/template1.component';
import { ResumePreviewComponent } from './resume-preview/resume-preview.component';
import { CommonService } from 'core/services/common.service';
import { ResumeBuilderResolver } from './resumebuilder.resolver';
import { ResumeProfessionalComponent } from './resume-professional/resume-professional.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
// import {EditorModule} from '@progress/kendo-angular-editor';

const routes: Routes = [
  {
    path: '',
    component: ResumebuilderComponent,
    resolve: {
      data: ResumeBuilderResolver
    },
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  declarations: [
    ResumebuilderComponent,
    ResumeTemplateComponent,
    AddWorkComponent,
    AddEducationComponent,
    AdditionalInfoComponent,
    ResumePreviewComponent,

    ResumeProfessionalComponent,

    PdfViewComponent
  ],
  entryComponents: [
    ResumeTemplateComponent,
    AddWorkComponent,
    AddEducationComponent,
    AdditionalInfoComponent,
    ResumePreviewComponent,

    ResumeProfessionalComponent,
    PdfViewComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatDatepickerModule,
    MatRadioModule,
    HttpClientModule,
    MatChipsModule,
    BarRatingModule,
    MatTooltipModule,
    MatStepperModule,
    MatCheckboxModule,
    MatDialogModule,
    FuseMaterialColorPickerModule,

    EditorModule,
    // EditorModule
  ],
  providers: [ResumeBuilderService, CommonService, ResumeBuilderResolver, CanDeactivateGuard],
  schemas: []
})
export class ResumebuilderModule { }
