import { Injectable } from '@angular/core';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AppConstant } from 'core/constants/app.constant';

@Injectable({
    providedIn: 'root',
})
export class ToastrService {
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    duration = 2500;

    constructor(
        private matToaster: MatSnackBar,
    ) {
    }

    /**
     * Common snackbar to display toastr messages
     * @param message Message to display
     * @param type Type of toastr
     */
    displaySnackBar(
        message: string,
        type: 'info' | 'error' | 'warning' | 'success',
        duration = this.duration
    ) {
        this.matToaster.open(message || AppConstant.ConstantMsgs.somethingWentWrong, 'X', {
            duration: duration,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            // panelClass: [type + '-snackbar'],
        });
    }
}
