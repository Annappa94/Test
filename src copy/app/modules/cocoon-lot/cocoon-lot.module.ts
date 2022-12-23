import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CocoonLotRoutingModule } from './cocoon-lot-routing.module';
import { MarkSoldComponent } from './lot-management/mark-sold/mark-sold.component';
import { CocoonLotCRUDComponent } from './lot-management/cocoon-lot-crud/cocoon-lot-crud.component';
import { CocoonDetailsComponent } from './lot-management/cocoon-details/cocoon-details.component';
import { CocoonListComponent } from './lot-management/cocoon-list.component';
import { SharedModule } from '../shared/shared.module';

import { CocoonCRUDComponent } from './lot-management/cocoon-crud/cocoon-crud.component';
import { ApprovalListComponent } from './approval-management/approval-list/approval-list.component';
import { CocoonApprovalCRUDComponent } from './lot-management/cocoon-approval-crud/cocoon-approval-crud.component';
import { PayoutRequestComponent } from './payout-request/payout-request.component';



@NgModule({
  declarations: [
    MarkSoldComponent,
    CocoonLotCRUDComponent,
    CocoonDetailsComponent,
    CocoonListComponent,

    CocoonCRUDComponent,
     ApprovalListComponent,
     CocoonApprovalCRUDComponent,
     PayoutRequestComponent,
  ],
  imports: [
    CommonModule,
    CocoonLotRoutingModule,
    SharedModule
  ]
})
export class CocoonLotModule { }
