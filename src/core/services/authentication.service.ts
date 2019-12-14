import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptDecryptService } from './encrypt-decrypt.service';
import { AppConstant } from 'core/constants/app.constant';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private _encryptDecryptService: EncryptDecryptService,
    private _fuseNavigationService: FuseNavigationService,
    private _router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      this._encryptDecryptService.getDecryptedLocalStorage(AppConstant.AuthStorageKey),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public set currentUserValue(value) {
    this.currentUserSubject.next(value);
  }

  login(loginAPI, userDetail): Observable<any> {
    return this.http.post<any>(loginAPI, userDetail).pipe(
      map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.data) {
          // console.log('userrrrrrrrrr', user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.setUserData(user.data);
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
    let redirection = '/auth/login';
    if (this.currentUserValue && this.currentUserValue.type && this.currentUserValue.type === 'admin') {
      redirection = '/ad/login';
    }
    this._encryptDecryptService.removeEncryptedLocalStorage(AppConstant.AuthStorageKey);
    this.currentUserSubject.next(null);
    this._router.navigate([redirection]);
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
          url: '/ad/dashboard'
        },
        {
          id: 'users',
          title: 'Users',
          translate: 'NAV.USERS',
          type: 'item',
          icon: 'people',
          url: '/ad/userlist'
        },
        {
          id: 'upload_templates',
          title: 'Upload Templates',
          translate: 'NAV.UPLOAD_TEMPLATES',
          type: 'item',
          icon: 'unarchive',
          url: '/ad/template-list'
        },
        {
          id: 'job_data_mgmt',
          title: 'Job Data Management',
          translate: 'NAV.JOB_DATA_MGMT',
          type: 'item',
          icon: 'work_outline',
          url: '/ad/job-mgmt'
        },
        {
          id: 'landing_page_mgmt',
          title: 'Landing Page Management',
          translate: 'NAV.LANDING_MGMT',
          type: 'item',
          icon: 'inbox',
          url: '/ad/content-mgmt'
        },
      ]

    };
    if (!this._fuseNavigationService.getNavigationItem('admin')) {
      // Remove user menu & add admin menu
      this._fuseNavigationService.removeNavigationItem('menu');
      this._fuseNavigationService.removeNavigationItem('customize');
      this._fuseNavigationService.addNavigationItem(customFunctionNavItem, 'end');
    }
  }

  setUserData(user): void {
    this._encryptDecryptService.setEncryptedLocalStorage(AppConstant.AuthStorageKey, user);
    this.currentUserSubject.next(user);
  }

  encryptPassword(password: string): string {
    return password;
    // return this._encryptDecryptService.encryptData(password).toString();
  }
}
