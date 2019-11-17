import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class EncryptDecryptService {
  private cryptoSecretKey = 'chosenyouweb';
  private sessionInitial = 'chosenyou';

  /**
   *Creates an instance of EncryptDecryptService.
   */
  constructor(private localStorageService: LocalStorageService) { }

  /**
   * Encrypts the data in Crypto AES format for security purpose
   * @returns Encrypted string
   */
  encryptData(data: any): string {
    return AES.encrypt(JSON.stringify(data), this.cryptoSecretKey);
  }

  /**
   * Decrypts the data from Crypto AES format to human understandable parsed format in
   * @returns Decrypted parsed data
   */
  decryptData(data: any): any {
    const bytes = AES.decrypt(data.toString(), this.cryptoSecretKey);
    if (bytes.toString()) {
      return JSON.parse(bytes.toString(enc.Utf8));
    }
  }

  /**
   * Sets encrypted secured localStorage data
   * @param key LocalStorage Key
   * @param data Data to be stored
   * @todo Do not stringify data to set localStorage if you use this method
   */
  setEncryptedLocalStorage(key: string, data: any): any {
    if (data && key) {
      const keyName = this.sessionInitial + '-' + key.trim();
      const encryptedString = this.encryptData(data);
      this.localStorageService.set(keyName, encryptedString);
    }
  }

  /**
   * Gets secured localStorage data after decryption
   * @param key LocalStorage Key
   * @returns Parsed localStorage data
   */
  getDecryptedLocalStorage(key: string): any {
    if (key) {
      const keyName = this.sessionInitial + '-' + key.trim();
      const storageData = this.localStorageService.get(keyName);
      return storageData;
    }
  }

  /**
   * Removes encrypted localStorage data
   * @param key LocalStorage Key
   */
  removeEncryptedLocalStorage(key: string): void {
    if (key) {
      const keyName = this.sessionInitial + '-' + key.trim();
      this.localStorageService.remove(keyName);
    }
  }
}
