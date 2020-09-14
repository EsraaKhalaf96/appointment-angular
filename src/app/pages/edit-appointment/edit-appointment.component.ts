import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBase } from "src/app/shared/Helper/FormBase";
import { FormBuilder, Validators } from "@angular/forms";
import { MessagesHelper } from "src/app/shared/Helper/MessagesService";
import { Router } from "@angular/router";
import { MessagesTypeEnum } from "src/app/shared/enum/MessagesTypeEnum";
import { EditAppointmentService } from "./edit-appointment.service";
import { LoaderService } from "src/app/shared/loader/loader.service";
import { CountdownComponent } from "ngx-countdown";

@Component({
  selector: "app-edit-appointment",
  templateUrl: "./edit-appointment.component.html",
  styleUrls: ["./edit-appointment.component.scss"],
})
export class EditAppointmentComponent extends FormBase implements OnInit {
  @ViewChild("cd", { static: false }) private countdown: CountdownComponent;

  showDialog: boolean = false;
  mobileSecretWord: string = "";
  returnedMobileSecretWord: string = "";
  showSecretWordValidation: boolean = false;
  countDownMinutes: number = 0;
  disableSendSMS: boolean = true;

  constructor(
    private fb: FormBuilder,
    _msgs: MessagesHelper,
    private router: Router,
    private _editAppointment: EditAppointmentService,
    public loaderService: LoaderService
  ) {
    super(_msgs);
  }

  ngOnInit() {
    this.createEditAppointmentForm();
  }

  showMobileDialog(status) {
    this.showDialog = status;
  }

  createEditAppointmentForm() {
    this.formObject = this.fb.group({
      refrenceNum: ["", Validators.required],
      customerMobileNo: ["", Validators.required],
    });
  }

  getAppontmentData() {
    if (this.validateForm().length > 0) {
      return;
    }
    this.loaderService.show();
    let appointmetId = this.formObject.value.refrenceNum;
    this._editAppointment
      .getAppointmentData(appointmetId)
      .subscribe((result) => {
        if (result.responseType == "1") {
          this.sendSMS();
        } else {
          this.loaderService.hide();
          this._msgs.showMessage(
            result.exceptionList[0].msgAr.message,
            MessagesTypeEnum.Error
          );
        }
      });
  }
  sendSMS() {
    // if (this.validateForm().length > 0) {
    //   return;
    // }

    this.loaderService.show();
    let formData = {
      customerMobileNo: this.formObject.value.customerMobileNo,
      id: this.formObject.value.refrenceNum,
    };
    this._editAppointment.sendSMS(formData).subscribe((result) => {
      if (result.responseType == "1") {
        this.returnedMobileSecretWord = result.data[0].checkCode;
        this.countDownMinutes = result.data[0].codeExp;
        this.loaderService.hide();
        this.showDialog = true;
        this.countdown.restart();
        this.disableSendSMS = true;
        setTimeout(() => {
          this.disableSendSMS = false;
        }, this.countDownMinutes * 60 * 1000);
      } else {
        this.loaderService.hide();
        this._msgs.showMessage(
          result.exceptionList[0].msgAr.message,
          MessagesTypeEnum.Error
        );
      }
    });
  }

  editAppointment() {
    if (this.mobileSecretWord == "" || this.mobileSecretWord == null) {
      this.showSecretWordValidation = true;
      return;
    }

    this.loaderService.show();
    if (this.validateForm().length == 0) {
      let obj = {
        customerMobileNo: this.formObject.value.customerMobileNo,
        passCode: this.mobileSecretWord,
        checkCode: this.returnedMobileSecretWord,
      };
      this._editAppointment.validateSMSVerifyCode(obj).subscribe((result) => {
        if (result.responseType == "1") {
          this.router.navigate(["/pages/appointment"], {
            queryParams: { refrenceId: this.formObject.value.refrenceNum },
          });
        } else {
          this.loaderService.hide();
          this.showSecretWordValidation = true;
          this._msgs.showMessage(
            result.exceptionList[0].msgAr.message,
            MessagesTypeEnum.Error
          );
        }
      });
    } else {
      this.loaderService.hide();
    }
  }
}
