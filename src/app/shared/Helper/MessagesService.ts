
import { ToastrService } from 'ngx-toastr';
import { MessagesTypeEnum } from '../enum/MessagesTypeEnum';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class MessagesHelper {
    constructor(private toastr: ToastrService) {
    }
  


    showMessage(msg: string, msgType: MessagesTypeEnum) {
        if (msgType == MessagesTypeEnum.Success) {
            this.showSuccess(msg);
        } 
        else if (msgType == MessagesTypeEnum.Error) {
            this.showError(msg);
        } else if (msgType == MessagesTypeEnum.Warning) {
            this.showWarning(msg);
        } else {
            this.showInfo(msg);
        }
    }


    private showSuccess(msg) {
        this.toastr.success(msg || 'Success.');
    }

    private showError(msg) {
        this.toastr.error(msg ||'Error.');
    }

    private showWarning(msg) {
        this.toastr.warning(msg ||'Warning.');
    }

    private showInfo(msg) {
        this.toastr.info(msg ||'Info.');
    }
}