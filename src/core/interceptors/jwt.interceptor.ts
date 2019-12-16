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
  isDisplaying = false;

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
      // if (!request.url.includes('Step') && !request.url.includes('jobFilter')) {
      if ( !request.url.endsWith('jobFilter')) {
        this.isDisplaying = true;
        this.loadingService.show();
      }
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
      finalize(() => {
        if ( this.isDisplaying === true ) {
          this.loadingService.hide();
          this.isDisplaying = false;
        }
      })
    );
  }
}
