import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChawkiOrderRoutingModule } from './chawki-order-routing.module';
import { ChawkiOrdersComponent } from './chawki-orders/chawki-orders.component';
import { ChawkiOrderDetailsComponent } from './chawki-orders/chawki-order-details/chawki-order-details.component';
import { ChawkiOrderCRUDComponent } from './chawki-orders/chawki-order-crud/chawki-order-crud.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ChawkiOrdersComponent,
    ChawkiOrderDetailsComponent,
    ChawkiOrderCRUDComponent
  ],
  imports: [
    CommonModule,
    ChawkiOrderRoutingModule,
    SharedModule
  ]
})
export class ChawkiOrderModule { }
