import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmerDashboardComponent } from './farmer-dashboard/farmer-dashboard.component';
import { ChawkiDashboardComponent } from './chawki-management/chawki-dashboard/chawki-dashboard.component';
import { CouponManagementComponent } from './coupon-dashboard/coupon-management.component';

const routes: Routes = [
  { path: 'farmer', component: FarmerDashboardComponent },
  { path: 'chawki', component: ChawkiDashboardComponent },
  { path: 'coupon', component: CouponManagementComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
