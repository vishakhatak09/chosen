import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getMomentFormattedDate(date: moment.Moment): string {
    const dateString = date.format('DD/MM/YYYY');
    return dateString;
  }

}
