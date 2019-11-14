import { Component } from '@angular/core';
import { AppConstant } from 'core/constants/app.constant';

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

    footerLink = AppConstant.FooterLinkUrl;
    /**
     * Constructor
     */
    constructor() {
    }
}
