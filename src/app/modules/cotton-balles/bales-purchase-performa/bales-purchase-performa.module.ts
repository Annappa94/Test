import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { BalesPurchasePerformaRoutingModule } from './bales-purchase-performa-routing.module';
// import { BalesPoListComponent } from './bales-po-list/bales-po-list.component';
import { BalesPoCrudComponent } from './bales-po-crud/bales-po-crud.component';
import { BalesPoDetailsComponent } from './bales-po-details/bales-po-details.component';


@NgModule({
  declarations: [
    // BalesPoListComponent,
    BalesPoCrudComponent,
    BalesPoDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BalesPurchasePerformaRoutingModule
  ]
})
export class BalesPurchasePerformaModule { }
