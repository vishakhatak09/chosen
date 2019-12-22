import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { JobFilterComponent } from '@fuse/components/search-bar/job-filter/job-filter.component';
import { JobDetailComponent } from 'app/main/apps/job-detail/job-detail.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Ng5SliderModule } from 'ng5-slider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    declarations: [
        ToolbarComponent,
        JobFilterComponent,
        JobDetailComponent
    ],
    entryComponents: [JobFilterComponent, JobDetailComponent],
    imports: [
        RouterModule,

        MatMenuModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        FormsModule,
        FuseSharedModule,
        MatDialogModule,
        MatTooltipModule,
        MatFormFieldModule,
        Ng5SliderModule,
        MatSelectModule,
        MatInputModule,
        MatChipsModule,

        FuseSharedModule,
        // FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarModule {
}
