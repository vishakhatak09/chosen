import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  ToastrService,
} from '../services/toastr.service';
import { AppConstant } from 'core/constants/app.constant';
import { AuthenticationService } from 'core/services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // console.log('intercept err', err);
        if (err.status === 401) {
          if (!request.url.includes('/login')) {
            // auto logout if 401 response returned from api
            this.authenticationService.logout();
            this.toastrService.displaySnackBar(AppConstant.ConstantMsgs.notAuthorized, 'error');
          }
        } else if (err.status === 402) {
          this.toastrService.displaySnackBar(AppConstant.ConstantMsgs.inactiveUser, 'error');
          // this.router.navigate(['/pagenotfound']);
        } else if (err.status === 400 && !request.url.includes('sentMail')) {
          this.toastrService.displaySnackBar(AppConstant.ConstantMsgs.somethingWentWrong, 'error');
          // this.router.navigate(['/pagenotfound']);
        } else if (err.status === 500) {
          this.toastrService.displaySnackBar(AppConstant.ConstantMsgs.internalServerError, 'error');
          // this.router.navigate(['/pagenotfound']);
        } else if (err.status === 504) {
          this.toastrService.displaySnackBar(AppConstant.ConstantMsgs.serverDown, 'error');
          // this.router.navigate(['/pagenotfound']);
        } else if (err.status === 0) {
          this.toastrService.displaySnackBar(AppConstant.ConstantMsgs.noInternet, 'error');
        } else {
          if ( !request.url.includes('sentMail')) {
            this.toastrService.displaySnackBar(err.statusText, 'error');
          }
        }
        const error = err.error || err.statusText;
        return throwError(error);
      }),
    );
  }
}
