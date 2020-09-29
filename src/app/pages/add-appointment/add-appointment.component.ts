import { Component, OnInit, ViewChild } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { SelectItem, ConfirmationService } from "primeng/api";
import { FormBase } from "src/app/shared/Helper/FormBase";
import { MessagesHelper } from "src/app/shared/Helper/MessagesService";
import { Router, ActivatedRoute } from "@angular/router";
import { AddAppointmentService } from "./add-appointment.service";
import { DatePipe } from "@angular/common";
import * as _ from "lodash";
import { LoaderService } from "src/app/shared/loader/loader.service";
import { MessagesTypeEnum } from "src/app/shared/enum/MessagesTypeEnum";
import { CountdownComponent } from "ngx-countdown";

@Component({
  selector: "app-add-appointment",
  templateUrl: "./add-appointment.component.html",
  styleUrls: ["./add-appointment.component.scss"],
})
export class AddAppointmentComponent extends FormBase implements OnInit {
  @ViewChild("cd", { static: false }) private countdown: CountdownComponent;
  submitted = false;
  showDialog: boolean = false;

  userNameDisabled: boolean = false;
  userMobileDisabled: boolean = false;
  userEmailDisabled: boolean = false;
  classesDDLDisabled: boolean = true;
  serviceDDLDisabled: boolean = true;
  centersDDLDisabled: boolean = true;
  timeSlotsDDLDisabled: boolean = true;

  classesDDLLoader: boolean = false;
  serviceDDLLoader: boolean = false;
  centersDDLLoader: boolean = false;
  timesDDLLoader: boolean = false;

  vehicleClassList: SelectItem[];
  serviceTypeList: SelectItem[];
  appointmentCentersList: SelectItem[];
  timeSlotList: SelectItem[];

  selectedVehicleClass: string = "";
  selectedServiceType: string = "";
  selectedAppointmentCenter: string = "";
  selectedLaneId: string = "";
  selectedStartTime: string = "";
  selectedEndTime: string = "";

  mobileSecretWord: string = "";
  returnedMobileSecretWord: string = "";
  showSecretWordValidation: boolean = false;

  referenceID: string = "";
  countDownMinutes: number = 0;
  disableSendSMS: boolean = true;
  counterSendSms: number = 0;
  maxresend: number = 1;
  counSendSmsnextBtn: number = 0;
  ar: any;
  minDate = new Date();
  defaultDate : Date = new Date();
  readonlyInput : boolean = true

  constructor(
    private fb: FormBuilder,
    _msgs: MessagesHelper,
    private router: Router,
    private _addAppointment: AddAppointmentService,
    private route: ActivatedRoute,
    public loaderService: LoaderService
  ) {
    super(_msgs);
  }

  ngOnInit() {
    this.ar = {
      firstDayOfWeek: 0,
      dayNames: [
        "الأحد",
        "الإثنين",
        "الثلاثاء",
        "الآربعاء",
        "الخميس",
        "الجمعة",
        "السبت",
      ],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
      monthNames: [
        "يناير",
        "فبراير",
        "مارس",
        "إبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "اكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
      monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      today: "اليوم",
      clear: "مسح",
      dateFormat: "mm/dd/yy",
      weekHeader: "Wk",
    };

    this.createAddAppointmentForm();

    this.referenceID = this.route.snapshot.queryParamMap.get("refrenceId");
    if (this.referenceID) {
      this.getAppointmentInfoEdit();
    } else {
      this.getVehicleClasses();
    }
  }

  getAppointmentInfoEdit() {
    this.loaderService.show();
    this._addAppointment
      .getAppointmentData(this.referenceID)
      .subscribe((result) => {
        if (result.responseType == "1") {
          this.userNameDisabled = true;
          this.userMobileDisabled = true;
          this.userEmailDisabled = true;
          this.classesDDLDisabled = true;
          this.serviceDDLDisabled = true;

          this.formObject.controls["id"].setValue(result.data[0].id);
          this.formObject.controls["customerName"].setValue(
            result.data[0].customerName
          );
          this.formObject.controls["customerEmail"].setValue(
            result.data[0].customerEmail
          );
          this.formObject.controls["customerMobileNo"].setValue(
            result.data[0].customerMobileNo
          );

          this.formObject.controls["serviceId"].setValue(
            result.data[0].serviceId
          );
          this.formObject.controls["centerId"].setValue(
            result.data[0].centerId
          );
          this.formObject.controls["vehicleClassId"].setValue(
            result.data[0].vehicleClassId
          );

          this.centersDDLDisabled = false;

          this.vehicleClassList = [];
          this.serviceTypeList = [];
          this.appointmentCentersList = [];
          this.vehicleClassList.push({
            label: result.data[0].vehicleClassDescAr,
            value: result.data[0].vehicleClassId,
          });
          this.serviceTypeList.push({
            label: result.data[0].serviceNameAr,
            value: result.data[0].serviceId,
          });
          this.appointmentCentersList.push({
            label: result.data[0].centerNameAr,
            value: result.data[0].centerId,
          });

          let newdate = result.data[0].apointmentDayDate
            .split("/")
            .reverse()
            .join("-");
          this.formObject.controls["apointmentDayDate"].setValue(
            new DatePipe("en-EN").transform(newdate, "MM/dd/yyyy")
          );

          this.selectedAppointmentCenter = result.data[0].centerId;
          this.selectedServiceType = result.data[0].serviceId;
          this.selectedVehicleClass = result.data[0].vehicleClassId;
          // this.getTimeSlots(newdate);

          let timeEvent =
            result.data[0].laneId +
            "$" +
            result.data[0].apointmentStartTime +
            "$" +
            result.data[0].apointmentEndTime;
          this.timeSlotChange(timeEvent);

          this.timeSlotList = [];
          this.timeSlotList.push({
            label: result.data[0].startTimeOnly,
            value:
              result.data[0].laneId +
              "$" +
              result.data[0].apointmentStartTime +
              "$" +
              result.data[0].apointmentEndTime,
          });

          this.loaderService.hide();
        } else {
          this.loaderService.hide();
          this._msgs.showMessage(
            result.exceptionList[0].msgAr.message,
            MessagesTypeEnum.Error
          );
        }
      });
  }

  getVehicleClasses() {
    this.classesDDLLoader = true;
    this._addAppointment.getVehicleClasses().subscribe((result) => {
      this.vehicleClassList = [];
      if (result.data.length > 0) {
        this.vehicleClassList.push({ label: "اختر نوع المركبة", value: -1 });
        for (let i = 0; i < result.data.length; i++) {
          this.vehicleClassList.push({
            label: result.data[i].descriptionAr,
            value: result.data[i].id,
          });
        }
      }
      this.classesDDLDisabled = false;
      this.classesDDLLoader = false;
    });
  }

  getServiceTypesList(vclClassId) {
    this.serviceDDLLoader = true;
    this._addAppointment.getServiceTypes(vclClassId).subscribe((result) => {
      this.serviceTypeList = [];
      if (result.data.length > 0) {
        this.serviceTypeList.push({ label: "اختر نوع خدمة الفحص", value: -1 });
        for (let i = 0; i < result.data.length; i++) {
          this.serviceTypeList.push({
            label: result.data[i].nameAr,
            value: result.data[i].id,
          });
        }
      }
      this.serviceDDLDisabled = false;
      this.serviceDDLLoader = false;
    });
    this.selectedVehicleClass = vclClassId;
  }

  serviceChange(service) {
    this.selectedServiceType = service;
    this.centersDDLDisabled = false;

    // Reset Cascading
    this.appointmentCentersList = [];
    this.formObject.controls["centerId"].setValue(null);
    // this.formObject.controls["apointmentDayDate"].setValue(null);
    this.timeSlotList = [];
    this.timeSlotsDDLDisabled = true;
    this.getTimeSlots(this.defaultDate);
  }

  getAppointmentCenterList(type) {
    this.centersDDLLoader = true;
    this._addAppointment
      .getAppointmentCenters(
        this.selectedVehicleClass,
        this.selectedServiceType
      )
      .subscribe((result) => {
        this.appointmentCentersList = [];
        if (result.data.length > 0) {
          this.appointmentCentersList.push({
            label: "اختر موقع مركز الفحص",
            value: -1,
          });
          for (let i = 0; i < result.data.length; i++) {
            this.appointmentCentersList.push({
              label: result.data[i].nameAr,
              value: result.data[i].id,
            });
          }
        }
        this.centersDDLDisabled = false;
        this.centersDDLLoader = false;
      });
  }

  centersChange(center) {
    this.selectedAppointmentCenter = center;
    // this.formObject.controls["apointmentDayDate"].setValue(null);
    this.timeSlotList = [];
    this.timeSlotsDDLDisabled = true;
    this.getTimeSlots(this.defaultDate);
  }


  getTimeSlots(date) {
    let selectedDate = new DatePipe("en-EN").transform(date, "dd-MM-yyyy");
    let formData = {
      centerId: this.selectedAppointmentCenter,
      serviceId: this.selectedServiceType,
      apointmentDayDate: selectedDate,
      vehicleClassId: this.selectedVehicleClass,
    };
    this.timesDDLLoader = true;
    this._addAppointment.getTimeSlots(formData).subscribe((result) => {
      this.timeSlotList = [];
      if (result.data.length > 0) {
        this.timeSlotList.push({ label: "اختر وقت الفحص", value: -1 });
        for (let i = 0; i < result.data.length; i++) {
          this.timeSlotList.push({
            label: result.data[i].startTimeOnly,
            value:
              result.data[i].laneId +
              "$" +
              result.data[i].startTime +
              "$" +
              result.data[i].endTime,
          });
        }
      }
      this.timeSlotsDDLDisabled = false;
      this.timesDDLLoader = false;
    });
  }

  timeSlotChange(event) {
    let splitValue = event.split("$");
    this.selectedLaneId = splitValue[0];
    this.selectedStartTime = splitValue[1];
    this.selectedEndTime = splitValue[2];

    this.formObject.controls["laneId"].setValue(splitValue[0]);
    this.formObject.controls["apointmentStartTime"].setValue(splitValue[1]);
    this.formObject.controls["apointmentEndTime"].setValue(splitValue[2]);
  }

  showMobileDialog(status) {
    this.showDialog = status;
  }

  createAddAppointmentForm() {
    this.formObject = this.fb.group({
      id: [null],
      customerName: ["", Validators.required],
      customerEmail: ["", [Validators.required, Validators.email]],
      customerMobileNo: ["", Validators.required],
      serviceId: ["", Validators.required],
      centerId: ["", Validators.required],
      vehicleClassId: ["", Validators.required],
      apointmentDayDate: ["", Validators.required],
      laneId: ["", Validators.required],
      apointmentStartTime: ["", Validators.required],
      apointmentEndTime: [""],
    });
  }

  sendSMS() {
    if (this.validateForm().length > 0) {
      return;
    }

    // Edit Mode
    if (this.referenceID) {
      this.loaderService.show();
      let formData = this.formObject.value;
      this._addAppointment.addAppointment(formData).subscribe((result) => {
        if (result.responseType == "1") {
          this.router.navigate(["/pages/confirmation"], {
            queryParams: { id: result.data[0].id },
          });
        } else {
          this.loaderService.hide();
          this._msgs.showMessage(
            result.exceptionList[0].msgAr.message,
            MessagesTypeEnum.Error
          );
        }
      });
      // Add Mode
    } else {
      this.loaderService.show();
      let formData = {
        customerMobileNo: this.formObject.value.customerMobileNo,
        id: null,
      };
      if(this.counSendSmsnextBtn == this.maxresend){
        this.loaderService.hide();
        this._msgs.showMessage("لقد تجاوزت عدد مرات الارسال. يرجى المحاوله لاحقا",MessagesTypeEnum.Error);
      }
      else{
        this._addAppointment.sendSMS(formData).subscribe((result) => {
          if (result.responseType == "1") {
  
            if (result.data[0].smsError == "1") {
              this.loaderService.hide();
              this._msgs.showMessage(result.data[0].errMsgLang2,MessagesTypeEnum.Error);
            } else {
              // console.log( this.counterSendSms);
              this.returnedMobileSecretWord = result.data[0].checkCode;
              this.countDownMinutes = result.data[0].codeExp;
              this.maxresend = result.data[0].maxResendCount;
              // console.log("maxresend" ,this.maxresend);
              this.loaderService.hide();
              this.counSendSmsnextBtn++;
              // console.log( this.maxresend);
  
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
            }
          } else {
            this.loaderService.hide();
            this._msgs.showMessage(result.exceptionList[0].msgAr.message,MessagesTypeEnum.Error);
          }
        });
      }
      
    }
  }

  addAppointment() {
    if (this.mobileSecretWord == "" || this.mobileSecretWord == null) {
      this.showSecretWordValidation = true;
      return;
    }

    this.loaderService.show();
    let obj = {
      customerMobileNo: this.formObject.value.customerMobileNo,
      passCode: this.mobileSecretWord,
      checkCode: this.returnedMobileSecretWord,
    };
    this._addAppointment.validateSMSVerifyCode(obj).subscribe((result) => {
      if (result.responseType == "1") {
        if (result.data[0].smsError == "1") {
          this.loaderService.hide();
          this._msgs.showMessage(
            result.data[0].errMsgLang2,
            MessagesTypeEnum.Error
          );
        } else {
          let formData = this.formObject.value;
          this._addAppointment.addAppointment(formData).subscribe((result) => {
            if (result.responseType == "1") {
              this.router.navigate(["/pages/confirmation"], {
                queryParams: { id: result.data[0].id },
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
  }
}
