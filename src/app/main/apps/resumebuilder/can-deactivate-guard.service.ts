import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ResumebuilderComponent } from './resumebuilder.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ResumebuilderComponent> {
    canDeactivate(component: ResumebuilderComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {

        const url: string = state.url;
        // console.log('Url: ' + url);
        const response = component.canDeactivate();
        return response;
    }
}
