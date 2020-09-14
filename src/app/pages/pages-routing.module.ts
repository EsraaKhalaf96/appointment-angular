import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';
import { DeleteAppointmentComponent } from './delete-appointment/delete-appointment.component';

const routes: Routes = [
  {
      path: '',
      component: PagesComponent,
      children: [
          { path: '', redirectTo:'appointment', pathMatch: 'full'},
          { path: 'appointment', component: AddAppointmentComponent, data: { title: 'Reservation' }},
          { path: 'edit-appointment', component: EditAppointmentComponent, data: { title: 'Edit Appointment' }},
          { path: 'delete-appointment', component: DeleteAppointmentComponent, data: { title: 'Delete Appointment' }},
          { path: 'confirmation', component: ConfirmationComponent, data: { title: 'Confirmation' }},
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
