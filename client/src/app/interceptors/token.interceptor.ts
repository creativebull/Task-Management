import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.getToken();
    if (currentUser !== null) {
      req = req.clone({
        headers: req.headers.append('Authorization', 'Bearer ' + currentUser),
      });
    }

    const methodsToAppend = ['DELETE', 'PATCH', 'PUT'];

    for (const method of methodsToAppend) {
      if (req.method.toUpperCase() === method) {
        req = req.clone({
          headers: req.headers.append('_method', method),
        });
      }
    }

    return next.handle(req);
  }
}
