import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CottonseedsRoutingModule } from './cottonseeds-routing.module';
import { SeedsSalesOrderCrudComponent } from './seeds-sales-order-crud/seeds-sales-order-crud.component';
import { SharedModule } from '../shared/shared.module';
import { CottonSeedsOrdersListComponent } from './cotton-seeds-orders-list/cotton-seeds-orders-list.component';
import { CottonSeedsPriceSheetComponent } from './cotton-seeds-price-sheet/cotton-seeds-price-sheet.component';
import { SeedsPriceSheetComponent } from './seeds-price-sheet/seeds-price-sheet.component';
import { CottonSeedSalesDetailsComponent } from './cotton-seed-sales-details/cotton-seed-sales-details.component';


@NgModule({
  declarations: [

    SeedsSalesOrderCrudComponent,
     CottonSeedsOrdersListComponent,
     CottonSeedsPriceSheetComponent,
     SeedsPriceSheetComponent,
     CottonSeedSalesDetailsComponent
  ],
  imports: [
    CommonModule,
    CottonseedsRoutingModule,
    SharedModule
  ]
})
export class CottonseedsModule { }
