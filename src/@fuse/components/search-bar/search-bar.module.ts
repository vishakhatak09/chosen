import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FuseSearchBarComponent } from './search-bar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { JobDetailComponent } from 'app/main/apps/job-detail/job-detail.component';

@NgModule({
    declarations: [
        FuseSearchBarComponent,
        JobDetailComponent
    ],
    entryComponents: [JobDetailComponent],
    imports: [
        CommonModule,
        RouterModule,

        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        FormsModule,
        FuseSharedModule,
        MatDialogModule
    ],
    exports: [
        FuseSearchBarComponent
    ]
})
export class FuseSearchBarModule {
}
