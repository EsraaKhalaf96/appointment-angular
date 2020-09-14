import { Component, OnInit } from '@angular/core';
import { AppointmentConfirmationService } from './confirmation.service'
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { MessagesTypeEnum } from 'src/app/shared/enum/MessagesTypeEnum';
import { MessagesHelper } from 'src/app/shared/Helper/MessagesService';
import { FormBase } from 'src/app/shared/Helper/FormBase';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent extends FormBase implements OnInit {

  appointmentConfirmation: boolean = true;
  appointmentDeletion: boolean = false;

  appointmentID: string = "";
  cancelID: string = ""

  // Appointment Date
  referenceNum: string = "";
  userName: string = "";
  userPhone: string = "";
  appointmentAddress: string = "";
  appointmentLat: string = "";
  appointmentLong: string = "";
  appointmentDate: string = "";
  appointmentTime: string = "";
  appointmentService: string = "";
  mapLocation: string = "";
  appointmentCenterName: string = "";

  constructor(
    private _appointmentConfirmation: AppointmentConfirmationService,
    private route: ActivatedRoute,
    _msgs: MessagesHelper,
    public loaderService: LoaderService) {
    super(_msgs)
  }

  ngOnInit() {
    this.appointmentID = this.route.snapshot.queryParamMap.get('id');
    this.cancelID = this.route.snapshot.queryParamMap.get('cancelRef');

    if (this.appointmentID) {
      this.getAppointmentInfo();
    }
    else if (this.cancelID) {
      this.appointmentConfirmation = false;
      this.appointmentDeletion = true;
    }

  }

  getAppointmentInfo() {
    this.loaderService.show();
    this._appointmentConfirmation.getAppointmentData(this.appointmentID).subscribe(result => {
      if (result.responseType == "1") {
        this.referenceNum = result.data[0].id;
        this.userName = result.data[0].customerName;
        this.userPhone = result.data[0].customerMobileNo;
        this.appointmentAddress = result.data[0].centerLocationAr;
        this.appointmentLat = result.data[0].centerLatitude;
        this.appointmentLong = result.data[0].centerLongitude;
        this.appointmentCenterName = result.data[0].centerNameAr;
        this.appointmentDate = result.data[0].hijrahDayDateAr + " , " + result.data[0].apointmentDayDate;
        this.appointmentTime = result.data[0].startTimeOnly;
        this.appointmentService = result.data[0].serviceNameAr + " - " + result.data[0].vehicleClassDescAr;
        this.mapLocation = "http://maps.google.com/maps?q=" + result.data[0].centerLatitude + "," + result.data[0].centerLongitude + "&ll=" + result.data[0].centerLatitude + "," + result.data[0].centerLongitude + "&z=17";

        this.appointmentConfirmation = true;
        this.appointmentDeletion = false;
        this.loaderService.hide();
      }
      else {
        this.loaderService.hide();
        this._msgs.showMessage(result.exceptionList[0].msgAr.message, MessagesTypeEnum.Error);
      }

    })
  }

}
