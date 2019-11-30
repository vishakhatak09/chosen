import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { Router } from '@angular/router';
import { EncryptDecryptService } from './encrypt-decrypt.service';
import { AppConstant } from 'core/constants/app.constant';

@Injectable()
export class AuthGuardService implements CanLoad {
  constructor(
    private router: Router,
    private _encryptDecryptService: EncryptDecryptService,
  ) { }
  canLoad(): any {
    const authData = this._encryptDecryptService.getDecryptedLocalStorage(AppConstant.AuthStorageKey);
    if (
      authData !== undefined && authData !== null &&
      authData.type !== undefined && authData.type.toLowerCase() === 'user') {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}

@Injectable()
export class AdminGuardService implements CanLoad {
  constructor(
    private router: Router,
    private _encryptDecryptService: EncryptDecryptService,
  ) { }
  canLoad(): any {
    const authData = this._encryptDecryptService.getDecryptedLocalStorage(AppConstant.AuthStorageKey);
    if (
      authData !== undefined && authData !== null &&
      authData.type !== undefined && authData.type.toLowerCase() === 'admin') {
      return true;
    } else {
      this.router.navigate(['/ad/login']);
    }
  }
}
