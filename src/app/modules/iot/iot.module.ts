import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IotRoutingModule } from './iot-routing.module';
import { RearingIotManagementComponent } from './rearing-iot-management/rearing-iot-management.component';
import { RearingIotManagementCrudComponent } from './rearing-iot-management/crud/rearing-iot-management-crud/rearing-iot-management-crud.component';
import { AdvisoryCrudComponent } from './rearing-iot-management/advisory-crud/advisory-crud.component';
import { IotDeviceDetailsComponent } from './rearing-iot-management/details/iot-device-details/iot-device-details.component';
import { SharedModule } from '../shared/shared.module';
import { RearingIotSettingsComponent } from './rearing-iot-management/rearing-iot-settings/rearing-iot-settings.component';
import { RearingIotAdvisoryListComponent } from './rearing-iot-management/rearing-iot-advisory-list/rearing-iot-advisory-list.component';
import { RearingIotDevicelistComponent } from './rearing-iot-management/rearing-iot-devicelist/rearing-iot-devicelist.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
@NgModule({
  declarations: [
    RearingIotManagementComponent,
    RearingIotManagementCrudComponent,
    AdvisoryCrudComponent,
    IotDeviceDetailsComponent,
    RearingIotSettingsComponent,
    RearingIotAdvisoryListComponent,
    RearingIotDevicelistComponent,
  ],
  imports: [
    CommonModule,
    IotRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class IotModule { }
