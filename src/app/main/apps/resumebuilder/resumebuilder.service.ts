import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ResumeBuilderService {

    public templateData: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private httpClient: HttpClient) { }

    addUpdateResume(resumeUrl: string, params: any): Observable<any> {
        return this.httpClient.post(resumeUrl, params);
    }
}
