import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CocoonLogisticsRoutingModule } from './cocoon-logistics-routing.module';
import { CocoonLotLogisticsComponent } from './cocoon-lot-logistics/cocoon-lot-logistics.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CocoonLotLogisticsComponent
  ],
  imports: [
    CommonModule,
    CocoonLogisticsRoutingModule,
    SharedModule
  ]
})
export class CocoonLogisticsModule { }
