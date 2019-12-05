import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  constructor(private http: HttpClient) { }

  public getContentMgmtData(apiUrl: string): Observable<any> {
    return this.http.get<any>(apiUrl);
  }

  public addUpdateContentMgmtData(apiUrl: string, params: any): Observable<any> {
    return this.http.post<any>(apiUrl, params);
  }

}
