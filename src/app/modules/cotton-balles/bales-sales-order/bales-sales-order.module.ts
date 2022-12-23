import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { BalesSalesOrderRoutingModule } from './bales-sales-order-routing.module';
// import { BalesSalesListComponent } from './bales-sales-list/bales-sales-list.component';
import { BalesSalesOrderCrudComponent } from './bales-sales-order-crud/bales-sales-order-crud.component';
import { BalesSalesDetailsComponent } from './bales-sales-detail/bales-sales-detail.component';


@NgModule({
  declarations: [
    // BalesSalesListComponent,
    BalesSalesOrderCrudComponent,
    BalesSalesDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BalesSalesOrderRoutingModule
  ]
})
export class BalesSalesOrderModule { }
