import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBase } from "src/app/shared/Helper/FormBase";
import { FormBuilder, Validators } from "@angular/forms";
import { MessagesHelper } from "src/app/shared/Helper/MessagesService";
import { Router } from "@angular/router";
import { DeleteAppointmentService } from "./delete-appointment.service";
import { LoaderService } from "src/app/shared/loader/loader.service";
import { MessagesTypeEnum } from "src/app/shared/enum/MessagesTypeEnum";
import { CountdownComponent } from "ngx-countdown";

@Component({
  selector: "app-delete-appointment",
  templateUrl: "./delete-appointment.component.html",
  styleUrls: ["./delete-appointment.component.scss"],
})
export class DeleteAppointmentComponent extends FormBase implements OnInit {
  @ViewChild("cd", { static: false }) private countdown: CountdownComponent;

  showDialog: boolean = false;
  mobileSecretWord: string = "";
  returnedMobileSecretWord: string = "";
  showSecretWordValidation: boolean = false;
  countDownMinutes: number = 0;
  disableSendSMS: boolean = true;
  counterSendSms: number = 0;
  maxresend: number = 1;
  counSendSmsnextBtn: number = 0;

  constructor(
    private fb: FormBuilder,
    _msgs: MessagesHelper,
    private router: Router,
    private _deleteAppointment: DeleteAppointmentService,
    public loaderService: LoaderService
  ) {
    super(_msgs);
  }

  ngOnInit() {
    this.createDeleteAppointmentForm();
  }

  showMobileDialog(status) {
    this.showDialog = status;
  }

  createDeleteAppointmentForm() {
    this.formObject = this.fb.group({
      refrenceNum: ["", Validators.required],
      customerMobileNo: ["", Validators.required],
    });
  }

  sendSMS() {
    if (this.validateForm().length > 0) {
      return;
    }

    this.loaderService.show();
    let formData = {
      customerMobileNo: this.formObject.value.customerMobileNo,
      id: this.formObject.value.refrenceNum,
    };
    if(this.counSendSmsnextBtn == this.maxresend){
      this.loaderService.hide();
      this._msgs.showMessage("لقد تجاوزت عدد مرات الارسال. يرجى المحاوله لاحقا",MessagesTypeEnum.Error);
    }
    else{
      this._deleteAppointment.sendSMS(formData).subscribe((result) => {
        if (result.responseType == "1") {
          if (result.data[0].smsError == "1") {
            this.loaderService.hide();
            this._msgs.showMessage(
              result.data[0].errMsgLang2,
              MessagesTypeEnum.Error
            );
          } else {
            this.returnedMobileSecretWord = result.data[0].checkCode;
            this.countDownMinutes = result.data[0].codeExp;
            this.maxresend = result.data[0].maxResendCount;
            this.loaderService.hide();
            this.counSendSmsnextBtn++;
            console.log(this.counSendSmsnextBtn);
            console.log(this.maxresend);
  
            this.showDialog = true;
            this.countdown.restart();
            this.disableSendSMS = true;
            if (this.counterSendSms === this.maxresend) {
              this.disableSendSMS = true; // can't click
            } else {
              setTimeout(() => {
                this.counterSendSms++;
                this.disableSendSMS = false; // can click
              }, this.countDownMinutes * 60 * 1000);
            }
            // setTimeout(() => { this.disableSendSMS = false; }, this.countDownMinutes * 60 * 1000)
          }
        } else {
          this.loaderService.hide();
          this._msgs.showMessage(
            result.exceptionList[0].msgAr.message,
            MessagesTypeEnum.Error
          );
        }
      });
    }

  }

  deleteAppointment() {
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
      this._deleteAppointment.validateSMSVerifyCode(obj).subscribe((result) => {
        if (result.responseType == "1") {
          if (result.data[0].smsError == "1") {
            this.loaderService.hide();
            this._msgs.showMessage(
              result.data[0].errMsgLang2,
              MessagesTypeEnum.Error
            );
          } else {
            let formData = {
              id: this.formObject.value.refrenceNum,
            };
            this._deleteAppointment
              .cancelAppointment(formData)
              .subscribe((result) => {
                if (result.responseType == "1") {
                  this.loaderService.hide();
                  this.router.navigate(["/pages/confirmation"], {
                    queryParams: {
                      cancelRef: this.formObject.value.refrenceNum,
                    },
                  });
                } else {
                  this.loaderService.hide();
                  this._msgs.showMessage(
                    result.exceptionList[0].msgAr.message,
                    MessagesTypeEnum.Error
                  );
                }
              });
          }
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
