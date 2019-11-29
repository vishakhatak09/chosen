import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateListService {

  constructor(private http: HttpClient) { }

  getTemplates(url: string): Observable<any> {
    return this.http.get(url);
  }

  deleteTemplate(deleteApi: string, param: any): Observable<any> {
    return this.http.post(deleteApi, param);
  }
}
