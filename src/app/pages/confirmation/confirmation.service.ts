import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreService } from 'src/app/shared/services/coreService';



@Injectable({
  providedIn: 'root'
})
export class AppointmentConfirmationService {

  constructor(private _coreService: CoreService) { }

  getAppointmentData(id): Observable<any> {
    return this._coreService.getAll("/getAppointmentById?appointmentId="+id);
  }
}
