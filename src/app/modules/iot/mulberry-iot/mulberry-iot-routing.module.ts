import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MulberryIotDevicesComponent } from './mulberry-iot-devices/mulberry-iot-devices.component';
import { FarmsManagementComponent } from './farms-management/farms-management.component';
import { PlotsManagementComponent } from './plots-management/plots-management.component';
import { MulberryDetailsComponent } from './mulberry-details/mulberry-details.component';
import { AdvisoryListComponent } from './advisory-list/advisory-list.component';
import { AdvisorylistDetailsComponent } from './advisory-list/advisorylist-details/advisorylist-details.component';
import { MulberryIotCrudComponent } from './mulberry-iot-crud/mulberry-iot-crud.component';

const routes: Routes = [
  { 
    path: '', 
     children:[
      { path: 'devices', component: MulberryIotDevicesComponent },
      { path: 'farms', component: FarmsManagementComponent },
      { path: 'plots', component: PlotsManagementComponent },
      { path: 'details/:id', component: MulberryDetailsComponent },
      { path: 'advisory-list',component:AdvisoryListComponent},
      { path: 'advisory-details/:code', component:AdvisorylistDetailsComponent},
      { path:'mulbery-crud', component:MulberryIotCrudComponent}
     ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MulberryIotRoutingModule { }
