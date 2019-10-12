import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { FuseSharedModule } from '@fuse/shared.module';


const routes: Routes = [
    {
        path: 'directives',
        loadChildren: './directives/directives.module#DirectivesModule'
    },
    {
        path: 'services',
        loadChildren: './services/services.module#ServicesModule'
    }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class DocumentationModule {
}
