import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CocoonOrderRoutingModule } from './cocoon-order-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CocoonOrderDetailsComponent } from './cocoon-order-details/cocoon-order-details.component';
import { CocoonOrdersComponent } from './cocoon-orders/cocoon-orders.component';


@NgModule({
  declarations: [
    CocoonOrderDetailsComponent,
    CocoonOrdersComponent
  ],
  imports: [
    CommonModule,
    CocoonOrderRoutingModule,
    SharedModule
  ]
})
export class CocoonOrderModule { }
