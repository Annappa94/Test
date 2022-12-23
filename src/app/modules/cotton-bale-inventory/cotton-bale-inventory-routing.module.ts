import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManufacturedInventoryComponent } from './manufactured-inventory/manufactured-inventory.component';
import { PurchaseInventoryComponent } from './purchase-inventory/purchase-inventory.component';
import { ManufacturedBalesSalesOrderCrudComponent } from './bales-sales-order-crud/bales-sales-order-crud.component'

const routes: Routes = [
  {path:"",component:ManufacturedInventoryComponent},
  {path:"manufacture",component:ManufacturedInventoryComponent},
  {path:"purchase", component:PurchaseInventoryComponent},
  {path:"sales-crud", component:ManufacturedBalesSalesOrderCrudComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CottonBaleInventoryRoutingModule { }
