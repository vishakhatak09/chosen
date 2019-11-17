import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptDecryptService } from './encrypt-decrypt.service';
import { AppConstant } from 'core/constants/app.constant';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private _encryptDecryptService: EncryptDecryptService,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      this._encryptDecryptService.getDecryptedLocalStorage(AppConstant.AuthStorageKey),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(loginAPI, userDetail): Observable<any> {
    return this.http.post<any>(loginAPI, userDetail).pipe(
      map(user => {
        // login successful if there's a jwt token in the response
        if (user) {
          // console.log('userrrrrrrrrr', user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this._encryptDecryptService.setEncryptedLocalStorage(AppConstant.AuthStorageKey, user);
          this.currentUserSubject.next(user);
        }
        return user;
      }),
    );
  }

  logout() {
    // remove user from local storage to log user out
    this._encryptDecryptService.removeEncryptedLocalStorage(AppConstant.AuthStorageKey);
    this.currentUserSubject.next(null);
  }
}
