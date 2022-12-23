import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvisoryCrudComponent } from './rearing-iot-management/advisory-crud/advisory-crud.component';
import { RearingIotManagementCrudComponent } from './rearing-iot-management/crud/rearing-iot-management-crud/rearing-iot-management-crud.component';
import { IotDeviceDetailsComponent } from './rearing-iot-management/details/iot-device-details/iot-device-details.component';
import { RearingIotDevicelistComponent } from './rearing-iot-management/rearing-iot-devicelist/rearing-iot-devicelist.component';
import { RearingIotManagementComponent } from './rearing-iot-management/rearing-iot-management.component';
import { RearingIotSettingsComponent } from './rearing-iot-management/rearing-iot-settings/rearing-iot-settings.component';
import { RearingIotAdvisoryListComponent } from './rearing-iot-management/rearing-iot-advisory-list/rearing-iot-advisory-list.component';
const routes: Routes = [
  { 
    path: '', 
     children:[
      { path: '', component: RearingIotManagementComponent },
      { path: 'crud', component: RearingIotManagementCrudComponent },
      { path: 'advisory-crud', component: AdvisoryCrudComponent },
      { path: 'advisory-crud/:id/:farmerId', component: AdvisoryCrudComponent },
      { path: 'crud/:id', component: RearingIotManagementCrudComponent },
      { path: 'details', component: IotDeviceDetailsComponent },
      { path: 'rearing-iot-global-settings', component: RearingIotSettingsComponent },
      { path: 'details/:deviceId/:farmerId', component: IotDeviceDetailsComponent },
      { path: 'rearing-iot-advisory-list', component: RearingIotAdvisoryListComponent},
      { path: 'rearing-iot-devicelist', component: RearingIotDevicelistComponent}
     ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IotRoutingModule { }
