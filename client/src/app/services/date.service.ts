import {Injectable} from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  static formatDate(date: string, format = 'DD-MM-YYYY HH:mm:ss') {
    return moment(date).format(format);
  }
}
