import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CottonOrderRoutingModule } from './cotton-order-routing.module';
import { CottonOrderMarkSoldComponent } from './cotton-order-mark-sold/cotton-order-mark-sold.component';
import { SharedModule } from '../shared/shared.module';
import { CottonOrderListComponent } from './cotton-order-list/cotton-order-list.component';
import { CottonOrderDetailsComponent } from './cotton-order-details/cotton-order-details.component';

@NgModule({
  declarations: [
    CottonOrderMarkSoldComponent,
    // CottonOrderListComponent,
    CottonOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    CottonOrderRoutingModule,
    SharedModule
  ],
  exports:[
  ]
})
export class CottonOrderModule { }
