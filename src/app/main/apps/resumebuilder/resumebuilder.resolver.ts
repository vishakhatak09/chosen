import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminTemplateModel } from 'core/models/admin-template.model';
import { ResumeBuilderService } from './resumebuilder.service';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ResumeBuilderResolver implements Resolve<AdminTemplateModel> {
    templateUrl = environment.serverBaseUrl + 'api/template/singleTemplate';

    constructor(
        private resumeBuilderService: ResumeBuilderService
    ) { }

    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<AdminTemplateModel> | Promise<AdminTemplateModel> | AdminTemplateModel {
        const templateId = route.paramMap.get('templateId');
        const params = {
            'params': {
                'templateId': templateId,
            }
        };
        // if (localStorage.getItem('selected')) {
            return this.resumeBuilderService.templateDetail(
                this.templateUrl, params
            );
        // } else {
        //     return null;
        // }
    }

}
