import { NgModule, Compiler } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
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
import 'hammerjs';
import { PageNotFoundComponent } from './main/pageNotFound/pageNotFound.component';

// import { JitCompilerFactory } from '@angular/platform-browser-dynamic';

const appRoutes: Routes = [
    {
        path: 'user',
        loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),
        canLoad: [AuthGuardService]
    },
    {
        path: 'auth',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
    },
    {
        path: 'ad',
        loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule),
    },
    {
        path: '404page',
        component: PageNotFoundComponent
    },
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        // redirectTo: '',
        // redirectTo: 'auth/login',
        redirectTo: '404page',
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),

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
        CoreModule,
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
