import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmsLogisticsRoutingModule } from './farms-logistics-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LogisticsListComponent } from './logistics-list/logistics-list.component';
import { LogisticsCrudComponent } from './logistics-crud/logistics-crud.component';
import { LogisticsDetailsComponent } from './logistics-details/logistics-details.component';
import { DriverCurdComponent } from './driver-curd/driver-curd.component';
import { VehicleCurdComponent } from './vehicle-curd/vehicle-curd.component';


@NgModule({
  declarations: [
    LogisticsListComponent,
    LogisticsCrudComponent,
    LogisticsDetailsComponent,
    DriverCurdComponent,
    VehicleCurdComponent
  ],
  imports: [
    CommonModule,
    FarmsLogisticsRoutingModule,
    SharedModule,
  ]
})
export class FarmsLogisticsModule { }
