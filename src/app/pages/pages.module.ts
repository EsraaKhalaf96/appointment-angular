import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';
import { DeleteAppointmentComponent } from './delete-appointment/delete-appointment.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';

import { CountdownModule, CountdownGlobalConfig } from 'ngx-countdown';


@NgModule({
  declarations: [
    PagesComponent,
    AddAppointmentComponent,
    ConfirmationComponent,
    AddAppointmentComponent,
    EditAppointmentComponent,
    DeleteAppointmentComponent,
    ConfirmationComponent
],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    InputMaskModule,
    DropdownModule,
    CalendarModule,
    CountdownModule
  ],
  providers: [
    // { provide: CountdownGlobalConfig, useFactory: countdownConfigFactory }
  ],
})
export class PagesModule { }
