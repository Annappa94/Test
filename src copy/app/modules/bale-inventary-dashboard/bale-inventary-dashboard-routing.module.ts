import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CottonBaleInventoryDashboardComponent } from '../bale-inventary-dashboard/cotton-bale-inventory-dashboard/cotton-bale-inventory-dashboard.component';


const routes: Routes = [
  {path:'', component:CottonBaleInventoryDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaleInventaryDashboardRoutingModule { }
