import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaleInventaryDashboardRoutingModule } from './bale-inventary-dashboard-routing.module';
import { CottonBaleInventoryDashboardComponent } from '../bale-inventary-dashboard/cotton-bale-inventory-dashboard/cotton-bale-inventory-dashboard.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CottonBaleInventoryDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BaleInventaryDashboardRoutingModule,
    
  ]
})
export class BaleInventaryDashboardModule { }
