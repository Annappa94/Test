import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceTypeComponent } from './device-type/device-type.component';
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



const routes: Routes = [
  { 
    path: '', 
     children:[
      { path: 'device-type', component: DeviceTypeComponent },
      { path: 'device-list', component:DeviceListComponent},
      { path: 'device-type-crud', component: DeviceTypeCrudComponent},
      { path: 'device-type-crud/:id', component: DeviceTypeCrudComponent},
      { path:'list-crud', component:DeviceListCrudComponent},
      { path: 'devicetype-details/:code', component:DevicetypeDetailsComponent},
      { path: 'divce-list-details/:id', component:DivceListDetailsComponent},
      { path:'list-crud/:id', component:DeviceListCrudComponent},
     
      { path: 'sales-order', component:SalesOrderComponent},
      { path: 'sales-order-details/:code', component:SalesOrderDetailsComponent},
      { path: 'sales-order-crud', component:SalesOrderCrudComponent},
      { path: 'iot-devices', component:IotDevicesComponent},
      { path: 'iot-devices/subscription/:id', component:IotDevicesCrudComponent},
      { path: 'iot-subscription', component:IotSubscriptionsComponent},


     ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceManagementRoutingModule { }
