import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumePreviewComponent } from './resume-preview.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

const routes: Routes = [
    {
        path: '',
        component: ResumePreviewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [
        FuseSharedModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule
    ],
    declarations: [ResumePreviewComponent],
})
export class ResumePreviewModule { }
