import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreService } from 'src/app/shared/services/coreService';



@Injectable({
  providedIn: 'root'
})
export class AddAppointmentService {

  constructor(private _coreService: CoreService) { }

  getVehicleClasses(): Observable<any> {
    return this._coreService.getAll("/getVehicleClasses");
  }

  getServiceTypes(vclClassId): Observable<any> {
    return this._coreService.getAll("/getServices?vclClassId=" + vclClassId);
  }

  getAppointmentCenters(vclClassId,serviceId): Observable<any> {
    return this._coreService.getAll("/getAvailableAppointmentCenters?vehicleClass="+vclClassId+"&serviceId="+serviceId);
  }

  getTimeSlots(model): Observable<any> {
    return this._coreService.post("/getAvailableAppointmentTimeSlots", model);
  }
  
  sendSMS(model): Observable<any> {
    return this._coreService.post("/sendSMSVerifyCode", model);
  }

  validateSMSVerifyCode(model): Observable<any> {
    return this._coreService.post("/validateSMSVerifyCode", model);
  }

  addAppointment(model): Observable<any> {
    return this._coreService.post("/bookedAppointment", model);
  }

  getAppointmentData(id): Observable<any> {
    return this._coreService.getAll("/getAppointmentById?appointmentId="+id);
  }
}
