import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CottonSeedsOrdersListComponent } from './cotton-seeds-orders-list/cotton-seeds-orders-list.component';
import { CottonSeedsPriceSheetComponent } from './cotton-seeds-price-sheet/cotton-seeds-price-sheet.component';
import { SeedsPriceSheetComponent } from './seeds-price-sheet/seeds-price-sheet.component';
import { SeedsSalesOrderCrudComponent } from './seeds-sales-order-crud/seeds-sales-order-crud.component';
import { CottonSeedSalesDetailsComponent } from './cotton-seed-sales-details/cotton-seed-sales-details.component';

const routes: Routes = [
  { path:"",component:SeedsSalesOrderCrudComponent},
  {path:"list",component:CottonSeedsOrdersListComponent},
  {path:"pricesheet",component:SeedsPriceSheetComponent},
  {path:"cotton-seeds-sales-details/:id", component:CottonSeedSalesDetailsComponent},
  {path:"cotton-seeds-sales-details", component:CottonSeedSalesDetailsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CottonseedsRoutingModule { }
