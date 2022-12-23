import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { BalesPurchasesRoutingModule } from './bales-purchases-routing.module';
// import { BalesPurchaseListComponent } from './bales-purchase-list/bales-purchase-list.component';
import { BalePurchasesCrudComponent } from './bale-purchases-crud/bale-purchases-crud.component';
import { BalePurchasesDetailsComponent } from './bale-purchases-details/bale-purchases-details.component';


@NgModule({
  declarations: [
    // BalesPurchaseListComponent,
    BalePurchasesCrudComponent,
    BalePurchasesDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    BalesPurchasesRoutingModule
  ]
})
export class BalesPurchasesModule { }
