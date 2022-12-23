import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogisticsListComponent } from './logistics-list/logistics-list.component';
import { LogisticsCrudComponent } from './logistics-crud/logistics-crud.component';
import { LogisticsDetailsComponent } from './logistics-details/logistics-details.component';
import { DriverCurdComponent } from './driver-curd/driver-curd.component';
import { VehicleCurdComponent } from './vehicle-curd/vehicle-curd.component';

const routes: Routes = [
  { path:"",component:LogisticsListComponent},
  { path:'crud',component:LogisticsCrudComponent },
  { path:'crud/:id',component:LogisticsCrudComponent },
  { path:'details/:id',component:LogisticsDetailsComponent },
  { path:'driver/curd/:id',component:DriverCurdComponent },
  { path:'vehicle/curd/:id',component:VehicleCurdComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmsLogisticsRoutingModule { }
