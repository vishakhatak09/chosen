import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobMgmtComponent } from './job-mgmt.component';
import { MatDialogModule } from '@angular/material/dialog';
import { JobMgmtService } from './job-mgmt.service';

const routes: Routes = [
  {
    path: '',
    component: JobMgmtComponent,
  }
];

@NgModule({
  declarations: [JobMgmtComponent],
  entryComponents: [],
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
    MatDialogModule
  ],
  providers: [
    JobMgmtService
  ]
})
export class JobMgmtModule { }
