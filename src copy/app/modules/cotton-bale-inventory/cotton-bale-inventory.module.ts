import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CottonBaleInventoryRoutingModule } from './cotton-bale-inventory-routing.module';
import { ManufacturedInventoryComponent } from './manufactured-inventory/manufactured-inventory.component';
import { PurchaseInventoryComponent } from './purchase-inventory/purchase-inventory.component';
import { SharedModule } from '../shared/shared.module';
import { ManufacturedBalesSalesOrderCrudComponent } from './bales-sales-order-crud/bales-sales-order-crud.component'

@NgModule({
  declarations: [
    ManufacturedInventoryComponent,
    PurchaseInventoryComponent,
    ManufacturedBalesSalesOrderCrudComponent
  ],
  imports: [
    CommonModule,
    CottonBaleInventoryRoutingModule,
    SharedModule
  ]
})
export class CottonBaleInventoryModule { }
