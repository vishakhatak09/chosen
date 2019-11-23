import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'core/services/authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  currentUser: any;

  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser && this.currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `${this.currentUser.token}`,
        },
      });
    }
    request = request.clone({
      setHeaders: {
        // 'Content-Type' : 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      }
    });
    return next.handle(request);
  }
}
