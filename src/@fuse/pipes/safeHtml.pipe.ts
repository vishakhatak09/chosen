import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private _domSanitizer: DomSanitizer) {}

  transform(value: any, args?: any): SafeHtml {
    let safeValue: any;
    if ( value ) {
      safeValue = this._domSanitizer.bypassSecurityTrustHtml(value);
    } else {
      safeValue = '';
    }
    return safeValue;
  }

}
