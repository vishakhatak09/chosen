import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { EncryptDecryptService } from './encrypt-decrypt.service';
import { AppConstant } from 'core/constants/app.constant';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private _encryptDecryptService: EncryptDecryptService,
  ) {}
  canActivate(): any {
    if (this._encryptDecryptService.getDecryptedLocalStorage(AppConstant.AuthStorageKey)) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}

@Injectable()
export class LoginGuardService implements CanActivate {
  constructor(
    private router: Router,
    private _encryptDecryptService: EncryptDecryptService,
  ) {}
  canActivate(): any {
    if (!this._encryptDecryptService.getDecryptedLocalStorage(AppConstant.AuthStorageKey)) {
      return true;
    } else {
      this.router.navigate(['/']);
    }
  }
}
