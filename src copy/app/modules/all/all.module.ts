import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllRoutingModule } from './all-routing.module';
import { QbMarketplaceComponent } from './qb-marketplace/qb-marketplace.component';
import { QbInputOrdersComponent } from './qb-input-orders/qb-input-orders.component';
import { QbInputDetailsOrderComponent } from './qb-input-orders/qb-input-details-order/qb-input-details-order.component';
import { FarmerFollowupsComponent } from './farmer-followups/farmer-followups.component';
import { SharedModule } from '../shared/shared.module';
import { SystemAuditComponent } from './system-audit/system-audit.component';
import { DispatchedCocoonLots } from './lot-management/logistics/dispatched-cocoon-lots.component';
import { CouponDetailsComponent } from './coupon-management/coupon-details/coupon-details.component';
import { CouponCRUDComponent } from './coupon-management/coupon-crud/coupon-crud.component';
import { ReferralCouponComponent } from './referral-coupons-list/referral-coupons-list.component';
import { RmCenterAuditComponent } from './rm-center-audit/rm-center-audit.component';
import { RmRolesComponent } from './rm-roles/rm-roles.component';
import { FarmerMarketPlaceComponent } from './farmer-marketplace/farmer-marketplace.component';


@NgModule({
  declarations: [
    QbMarketplaceComponent,
    QbInputOrdersComponent,
    QbInputDetailsOrderComponent,
    FarmerFollowupsComponent,
    SystemAuditComponent,
    DispatchedCocoonLots,
    CouponDetailsComponent,
    CouponCRUDComponent,
    ReferralCouponComponent,
    RmCenterAuditComponent,
    RmRolesComponent,
    FarmerMarketPlaceComponent
    
  ],
  imports: [
    CommonModule,
    AllRoutingModule,
    SharedModule
  ]
})
export class AllModule { }