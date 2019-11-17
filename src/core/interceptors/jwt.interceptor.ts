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
    if (this.currentUser && this.currentUser.data.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `${this.currentUser.data.token}`,
        },
      });
    }

    return next.handle(request);
  }
}
