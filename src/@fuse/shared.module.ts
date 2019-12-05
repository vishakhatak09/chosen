import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { ConfirmationDialogComponent } from 'app/main/pages/common-components/confirmation/confirmation.component';
import { PreviewComponent } from 'app/main/pages/common-components/preview/preview.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    entryComponents: [ConfirmationDialogComponent, PreviewComponent],
    declarations: [ConfirmationDialogComponent, PreviewComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        FuseDirectivesModule,
        FusePipesModule,

        TranslateModule,

        MatButtonModule,
        MatIconModule,
        MatRippleModule,
        MatTooltipModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        FuseDirectivesModule,
        FusePipesModule,
        TranslateModule,

        MatButtonModule,
        MatIconModule,
        MatRippleModule,
        MatTooltipModule
    ]
})
export class FuseSharedModule {
}
