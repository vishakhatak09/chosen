import { NgModule } from '@angular/core';
import { AddJobComponent } from './add-job.component';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { Ng5SliderModule } from 'ng5-slider';
import { CommonService } from 'core/services/common.service';

const routes: Routes = [
  {
    path: '',
    component: AddJobComponent,
  }
];

@NgModule({
  declarations: [AddJobComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    Ng5SliderModule
  ],
  providers: [CommonService]
})
export class AddJobModule { }
