import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptDecryptService } from './encrypt-decrypt.service';
import { AppConstant } from 'core/constants/app.constant';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private _encryptDecryptService: EncryptDecryptService,
    private _fuseNavigationService: FuseNavigationService,
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
          this.setUserData(user);
        }
        return user;
      }),
    );
  }

  register(registerApi: string, params): Observable<any> {
    return this.http.post(registerApi, params);
  }

  forgotPassword(forgotPswdApi: string, params): Observable<any> {
    return this.http.post(forgotPswdApi, params);
  }

  resetPassword(resetPasswordApi: string, params): Observable<any> {
    return this.http.post(resetPasswordApi, params);
  }

  logout() {
    // remove user from local storage to log user out
    this._encryptDecryptService.removeEncryptedLocalStorage(AppConstant.AuthStorageKey);
    this.currentUserSubject.next(null);
  }

  /**
   * Set admin navigation items
   */
  setAdminNavigation(): void {
    const customFunctionNavItem = {
      id: 'admin',
      title: 'Admin',
      translate: 'NAV.ADMIN',
      type: 'group',
      icon: 'user',
      children: [
        {
          id: 'admin-dashboard',
          title: 'Dashboard',
          translate: 'NAV.DASHBOARDS',
          type: 'item',
          icon: 'dashboard',
          url: '/apps/admin-dashboard'
        },
        {
          id: 'users',
          title: 'Users',
          translate: 'NAV.USERS',
          type: 'item',
          icon: 'people',
          url: '/apps/userlist'
        },
        {
          id: 'content_mgmt',
          title: 'Content Management',
          translate: 'NAV.CONTENT_MGMT',
          type: 'collapsable',
          icon: 'ballot',
          children: [
            {
              id: 'upload_resume',
              title: 'Upload Resume',
              translate: 'NAV.UPLOAD_RESUME',
              type: 'item',
              icon: 'unarchive',
              url: '/apps/test'
            },
            {
              id: 'job_data_mgmt',
              title: 'Job Data Management',
              translate: 'NAV.JOB_DATA_MGMT',
              type: 'item',
              icon: 'file_copy',
              url: '/apps/test'
            },
            {
              id: 'landing_page_mgmt',
              title: 'Landing Page Management',
              translate: 'NAV.LANDING_MGMT',
              type: 'item',
              icon: 'inbox',
              url: '/apps/test'
            },
          ]
        }
      ]

    };
    if (!this._fuseNavigationService.getNavigationItem('admin')) {
      this._fuseNavigationService.addNavigationItem(customFunctionNavItem, 'end');
    }
  }

  setUserData(user): void {
    this._encryptDecryptService.setEncryptedLocalStorage(AppConstant.AuthStorageKey, user);
    this.currentUserSubject.next(user);
  }
}
