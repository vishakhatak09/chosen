import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'core/services/authentication.service';
import { LoadingScreenService } from '@fuse/services/loading.service';
import { finalize } from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  currentUser: any;

  constructor(
    private authenticationService: AuthenticationService,
    private loadingService: LoadingScreenService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser && this.currentUser.token) {
      this.loadingService.show();
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
    return next.handle(request).pipe(
      finalize(() => this.loadingService.hide())
    );
  }
}
