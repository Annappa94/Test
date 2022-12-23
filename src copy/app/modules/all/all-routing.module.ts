import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { CheckersComponent } from '../weaver-sku-batch/checkers/checkers.component';
import { CouponCRUDComponent } from './coupon-management/coupon-crud/coupon-crud.component';
import { CouponDetailsComponent } from './coupon-management/coupon-details/coupon-details.component';
import { FarmerFollowupsComponent } from './farmer-followups/farmer-followups.component';
import { FarmerMarketPlaceComponent } from './farmer-marketplace/farmer-marketplace.component';
import { DispatchedCocoonLots } from './lot-management/logistics/dispatched-cocoon-lots.component';
import { QbInputDetailsOrderComponent } from './qb-input-orders/qb-input-details-order/qb-input-details-order.component';
import { QbInputOrdersComponent } from './qb-input-orders/qb-input-orders.component';
import { QbMarketplaceComponent } from './qb-marketplace/qb-marketplace.component';
import { ReferralCouponComponent } from './referral-coupons-list/referral-coupons-list.component';
import { RmCenterAuditComponent } from './rm-center-audit/rm-center-audit.component';
import { RmRolesComponent } from './rm-roles/rm-roles.component';
import { SystemAuditComponent } from './system-audit/system-audit.component';

const routes: Routes = [
  { 
    path:'',
    children:[
      { path: 'qb-marketplace', component: QbMarketplaceComponent },
      { path: 'qb-input-orders', component: QbInputOrdersComponent },
      { path: 'qb-input-details-orders', component: QbInputDetailsOrderComponent },
      { path: 'farmer-followups', component: FarmerFollowupsComponent },
      { path: 'centers-audit/:centerId', component: RmCenterAuditComponent, },

      { path: 'coupon-crud/:id', component: CouponCRUDComponent },
      { path: 'coupon-crud', component: CouponCRUDComponent },

      { path: 'referral-coupon-list', component: ReferralCouponComponent },
      { path: 'system-audit', component: SystemAuditComponent },

      { path: 'coupon-details', component: CouponDetailsComponent },
      { path: 'coupon-details/:id', component: CouponDetailsComponent },

      { path: 'roles', component: RmRolesComponent },
      // { path: 'all-notifications', component: CheckersComponent },
      { path: 'farmer-marketplace', component: FarmerMarketPlaceComponent },

      {
        path: 'dispatched-lots', 
        children:[
         { path: '', component: DispatchedCocoonLots },
        ] 
     },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllRoutingModule { }
