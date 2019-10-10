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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BarRatingModule } from 'ngx-bar-rating';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
      path     : '',
      component: ResumebuilderComponent,
      children : [],
  }
];

@NgModule({
  declarations: [ResumebuilderComponent],
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
    CKEditorModule,
    MatChipsModule,
    MatAutocompleteModule,
    BarRatingModule,
    MatTooltipModule

  ]
})
export class ResumebuilderModule { }
