import { NgModule, Compiler } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule
} from '@fuse/components';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from 'app/app.component';
import { fuseConfig } from 'app/fuse-config';
import { LayoutModule } from 'app/layout/layout.module';
import { CoreModule } from 'core/core.module';
import { AuthGuardService, AdminGuardService } from 'core/services/auth-guard.service';
import { LandingComponent } from './main/landing/landing.component';
import 'hammerjs';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';

const appRoutes: Routes = [
    // {
    //     path: '',
    //     component: LandingComponent
    // },
    {
        path: 'user',
        loadChildren: './main/apps/apps.module#AppsModule',
        canLoad: [AuthGuardService]
    },
    {
        path: 'auth',
        loadChildren: './main/pages/pages.module#PagesModule'
    },
    {
        path: 'ad',
        loadChildren: './main/admin/admin.module#AdminModule',
        canLoad: [AdminGuardService]
    },
    {
        path: '**',
        // redirectTo: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        CoreModule
    ],
    providers: [
        AuthGuardService,
        AdminGuardService,
        { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },
        { provide: 'WINDOW', useFactory: getWindow },
        // {provide: Compiler, useFactory: createJitCompiler}
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}

export function getLocalStorage(): Storage {
    return typeof window !== 'undefined' ? window.localStorage : null;
}

export function getWindow(): Window {
    return typeof window !== 'undefined' ? window : null;
}


// export function createJitCompiler() {
//     return new JitCompilerFactory().createCompiler([{
//         useJit: true
//     }]);
// }
