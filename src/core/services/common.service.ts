import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getMomentFormattedDate(date: moment.Moment, format = 'MM/DD/YYYY'): string {
    const dateString = date.format(format);
    return dateString;
  }

}
