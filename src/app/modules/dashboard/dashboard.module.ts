import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { FarmerDashboardComponent } from './farmer-dashboard/farmer-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ChawkiDashboardComponent } from './chawki-management/chawki-dashboard/chawki-dashboard.component';
import { CouponManagementComponent } from './coupon-dashboard/coupon-management.component';


@NgModule({
  declarations: [
    FarmerDashboardComponent,
    ChawkiDashboardComponent,
    CouponManagementComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
