import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalesSalesListComponent } from './bales-sales-list/bales-sales-list.component';
import { BalesSalesOrderCrudComponent } from './bales-sales-order-crud/bales-sales-order-crud.component';
import { BalesSalesDetailsComponent }  from './bales-sales-detail/bales-sales-detail.component';

const routes: Routes = [
  {path:"",component:BalesSalesListComponent},
  {path:"crud", component:BalesSalesOrderCrudComponent},
  // { path:'crud/:id',component: },
  { path:'details/:id',component: BalesSalesDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalesSalesOrderRoutingModule { }
