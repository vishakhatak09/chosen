import { NgModule } from '@angular/core';

import { FuseIfOnDomDirective } from '@fuse/directives/fuse-if-on-dom/fuse-if-on-dom.directive';
import { FuseInnerScrollDirective } from '@fuse/directives/fuse-inner-scroll/fuse-inner-scroll.directive';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import {
    FuseMatSidenavHelperDirective,
    FuseMatSidenavTogglerDirective
} from '@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.directive';
import { FileDropDirective } from './file-drop.directive';
import { FileDirective } from './file.directive';
import { TemplateDynamicDirective } from './template-dynamic.directive';
import { InputRestrictionDirective } from './input-restriction.directive';

@NgModule({
    declarations: [
        FuseIfOnDomDirective,
        FuseInnerScrollDirective,
        FuseMatSidenavHelperDirective,
        FuseMatSidenavTogglerDirective,
        FusePerfectScrollbarDirective,
        FileDropDirective,
        FileDirective,
        TemplateDynamicDirective,
        InputRestrictionDirective
    ],
    imports: [],
    exports: [
        FuseIfOnDomDirective,
        FuseInnerScrollDirective,
        FuseMatSidenavHelperDirective,
        FuseMatSidenavTogglerDirective,
        FusePerfectScrollbarDirective,
        FileDropDirective,
        FileDirective,
        TemplateDynamicDirective,
        InputRestrictionDirective
    ]
})
export class FuseDirectivesModule {
}
