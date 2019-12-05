import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FuseSearchBarComponent } from './search-bar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        FuseSearchBarComponent
    ],
    imports: [
        CommonModule,
        RouterModule,

        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [
        FuseSearchBarComponent
    ]
})
export class FuseSearchBarModule {
}
