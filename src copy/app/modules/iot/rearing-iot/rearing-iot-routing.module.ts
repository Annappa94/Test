import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RearingIotDevicesComponent } from './rearing-iot-devices/rearing-iot-devices.component';
import { AdvisoryListComponent } from './advisory-list/advisory-list.component';
import { AdvisorylistDetailsComponent } from './advisory-list/advisorylist-details/advisorylist-details.component';
import { RearingIotCrudComponent } from './rearing-iot-crud/rearing-iot-crud.component';
import { RearingIotDeviceDetailsComponent } from './rearing-iot-device-details/rearing-iot-device-details.component';

const routes: Routes = [
  { 
    path: '', 
     children:[
      { path: 'devices', component: RearingIotDevicesComponent },
      { path: 'devices/crud', component: RearingIotCrudComponent },
      { path: 'devices/crud/:id', component: RearingIotCrudComponent },
      { path: 'advisory-list',component:AdvisoryListComponent},
      { path: 'advisory-details/:code', component:AdvisorylistDetailsComponent},
      { path: 'rearing-iot-device-details/:deviceId', component:RearingIotDeviceDetailsComponent},
     ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RearingIotRoutingModule { }
