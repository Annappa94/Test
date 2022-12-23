import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { RearingIotRoutingModule } from './rearing-iot-routing.module';
import { RearingIotDevicesComponent } from './rearing-iot-devices/rearing-iot-devices.component';
import { AdvisoryListComponent } from './advisory-list/advisory-list.component';
import { AdvisorylistDetailsComponent } from './advisory-list/advisorylist-details/advisorylist-details.component';
import { RearingIotCrudComponent } from './rearing-iot-crud/rearing-iot-crud.component';
import { RearingIotDeviceDetailsComponent } from './rearing-iot-device-details/rearing-iot-device-details.component';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';


@NgModule({
  declarations: [
    RearingIotDevicesComponent,
    AdvisoryListComponent,
    AdvisorylistDetailsComponent,
    RearingIotCrudComponent,
    RearingIotDeviceDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RearingIotRoutingModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
  ]
})
export class RearingIotModule { }
