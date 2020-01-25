import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { StateCity } from 'core/constants/location';
import { CityModel } from 'core/models/job.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private maxSalary = 100;
  locationUrl = 'core/constants/location.json';

  constructor(private http: HttpClient) { }

  getMomentFormattedDate(date: moment.Moment, format = 'MM/DD/YYYY'): string {
    if ( typeof date === 'string' ) {
      date = moment(new Date(date));
    }
    const dateString = date.format(format);
    return dateString;
  }

  getMomentFromDate(date: string): moment.Moment {
    const convertedDate = moment(new Date(date));
    return convertedDate;
  }

  getSalaryOptions(): string[] {
    const options: any[] = ['<0.5'];
    let value = 0;
    while (value < this.maxSalary) {
      if (value >= 50) {
        if (value === 50) {
          options.push(value);
        }
        value = (value + 10);
        options.push(value + '+');
      } else {
        options.push(value);
        value++;
      }
    }
    return options;
  }

  getStateList(): string[] {

    const stateList = StateCity;
    return Object.keys(stateList);

  }

  getCity(stateName: string): CityModel[] {
    const stateList = StateCity;
    return stateList[stateName];
  }

  addUpdateJob(addUpdateApi: string, params: any): Observable<any> {
    return this.http.post(addUpdateApi, params);
  }

  getSingleJob(getSingleJobApi: string, params: any): Observable<any> {
    return this.http.post(getSingleJobApi, params);
  }

  searchJob(searchUrl: string, params: any): Observable<any>{
    return this.http.post(searchUrl, params);
  }

  searchAllJob(searchUrl: string): Observable<any>{
    return this.http.get(searchUrl);
  }

}
