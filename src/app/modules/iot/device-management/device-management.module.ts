import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { DeviceManagementRoutingModule } from './device-management-routing.module';
import { DeviceTypeComponent } from './device-type/device-type.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceTypeCrudComponent } from './device-type/device-type-crud/device-type-crud.component';
import { DeviceListCrudComponent } from './device-list-crud/device-list-crud.component';
import { DevicetypeDetailsComponent } from './device-type/devicetype-details/devicetype-details.component';
import { DivceListDetailsComponent } from './divce-list-details/divce-list-details.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SalesOrderDetailsComponent } from './sales-order/sales-order-details/sales-order-details.component';
import { SalesOrderCrudComponent } from './sales-order/sales-order-crud/sales-order-crud.component';
import { IotDevicesComponent } from './iot-devices/iot-devices.component';
import { IotSubscriptionsComponent } from './iot-subscriptions/iot-subscriptions.component';
import { IotDevicesCrudComponent } from './iot-devices/iot-devices-crud/iot-devices-crud.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";



@NgModule({
  declarations: [
    DeviceTypeComponent,
    DeviceListComponent,
    DeviceTypeCrudComponent,
    DeviceListCrudComponent,
    DevicetypeDetailsComponent,
    DivceListDetailsComponent,
    SalesOrderComponent,
    SalesOrderDetailsComponent,
    SalesOrderCrudComponent,
    IotDevicesComponent,
    IotSubscriptionsComponent,
    IotDevicesCrudComponent
  ],
  
  imports: [
    CommonModule,
    SharedModule,
    DeviceManagementRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    ClipboardModule
  ]
})
export class DeviceManagementModule { }
