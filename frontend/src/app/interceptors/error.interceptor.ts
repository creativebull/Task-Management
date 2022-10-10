import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('report_error') || req.url.includes('logout')) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          console.warn('401 response, Logging user out');
          // Auto logout if 401 response
          this.authService.logout();
        }

        return throwError(err);
      }));
  }
}
