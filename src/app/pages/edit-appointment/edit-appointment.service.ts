import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreService } from "src/app/shared/services/coreService";

@Injectable({
  providedIn: "root",
})
export class EditAppointmentService {
  constructor(private _coreService: CoreService) {}

  sendSMS(model): Observable<any> {
    return this._coreService.post("/sendSMSVerifyCode", model);
  }

  validateSMSVerifyCode(model): Observable<any> {
    return this._coreService.post("/validateSMSVerifyCode", model);
  }
}
