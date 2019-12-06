import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobMgmtService {
    constructor(private httpClient: HttpClient) { }

    getJobList(jobListapi: string): Observable<any> {
        return this.httpClient.get(jobListapi);
    }

    deleteJob(deleteJobApi: string, params: any): Observable<any> {
        return this.httpClient.post(deleteJobApi, params);
    }

}
