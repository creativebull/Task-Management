import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) {
  }

  private apiUrl = environment.apiUrl;

  public static addCurrency(money: string, code: string) {
    const userLocale = CurrencyService.getLang();

    // Remove formatting from number
    money = money.replace(/,/g, '');

    if (isNaN(parseFloat(money))) {
      return Intl.NumberFormat(userLocale, {
        style: 'currency',
        currency: code
      }).format(parseFloat('0'));
    }

    return Intl.NumberFormat(userLocale, {
      style: 'currency',
      currency: code
    }).format(parseFloat(money));
  }

  static getLang() {
    if (navigator.languages !== undefined) {
      return navigator.languages[0];
    } else {
      return navigator.language;
    }
  }

  allCurrencies(): Observable<any> {
    return this.http.get(this.apiUrl + 'public/currency/all-currencies');
  }
}
