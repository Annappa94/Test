import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CottonSeedsSalesRoutingModule } from './cotton-seeds-sales-routing.module';
import { SeedsSalesPurchaseListComponent } from './seeds-sales-purchase-list/seeds-sales-purchase-list.component';
import { SharedModule } from '../shared/shared.module';
import { CottonSeedsCrudComponent } from './cotton-seeds-crud/cotton-seeds-crud.component';
import { SeedsOrderCrudComponent } from './seeds-order-crud/seeds-order-crud.component';


@NgModule({
  declarations: [
    SeedsSalesPurchaseListComponent,
    CottonSeedsCrudComponent,
    SeedsOrderCrudComponent
  ],
  imports: [
    CommonModule,
    CottonSeedsSalesRoutingModule,
    SharedModule
  ]
})
export class CottonSeedsSalesModule { }
