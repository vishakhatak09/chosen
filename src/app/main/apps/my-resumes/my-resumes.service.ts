import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyResumesService {

  constructor(private http: HttpClient) { }

  getMyResumes(url: string): Observable<any> {
    return this.http.get(url);
  }

  deleteResume(url: string, params: any): Observable<any> {
    return this.http.post(url, params);
  }

}
