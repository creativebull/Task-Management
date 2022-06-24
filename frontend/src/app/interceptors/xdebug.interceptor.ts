import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()

export class XdebugInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const debugMode = environment.apiDebug;

    if (debugMode) {
      req = req.clone({
        setParams: {
          XDEBUG_SESSION_START: 'PHPSTORM'
        }
      });
    }

    return next.handle(req);
  }
}
