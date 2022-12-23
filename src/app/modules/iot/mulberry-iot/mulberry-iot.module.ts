import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { MulberryIotRoutingModule } from './mulberry-iot-routing.module';
import { MulberryIotDevicesComponent } from './mulberry-iot-devices/mulberry-iot-devices.component';
import { FarmsManagementComponent } from './farms-management/farms-management.component';
import { PlotsManagementComponent } from './plots-management/plots-management.component';
import { MulberryDetailsComponent } from './mulberry-details/mulberry-details.component';
import { AdvisoryListComponent } from './advisory-list/advisory-list.component';
import { AdvisorylistDetailsComponent } from './advisory-list/advisorylist-details/advisorylist-details.component';
import { MulberryIotCrudComponent } from './mulberry-iot-crud/mulberry-iot-crud.component';


@NgModule({
  declarations: [
    MulberryIotDevicesComponent,
    FarmsManagementComponent,
    PlotsManagementComponent,
    MulberryDetailsComponent,
    AdvisoryListComponent,
    AdvisorylistDetailsComponent,
    MulberryIotCrudComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MulberryIotRoutingModule
  ]
})
export class MulberryIotModule { }
