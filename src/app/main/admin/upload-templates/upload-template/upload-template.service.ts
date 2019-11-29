import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadTemplateService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  getSingleTemplateData(getTemplateApi: string, params: any): Observable<any> {
    return this._httpClient.post<any>(getTemplateApi, params);
  }

  createUpdateTemplate(createUpdateApi: string, param: any): Observable<any> {
    return this._httpClient.post(createUpdateApi, param);
  }
}
