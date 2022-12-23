import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PupaeOrderRoutingModule } from './pupae-order-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PupaeOrderComponent } from './pupae-order/pupae-order.component';
import { PupaeOrderDetailsComponent } from './pupae-order-details/pupae-order-details.component';


@NgModule({
  declarations: [
    PupaeOrderComponent,
    PupaeOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    PupaeOrderRoutingModule,
    SharedModule
  ]
})
export class PupaeOrderModule { }
