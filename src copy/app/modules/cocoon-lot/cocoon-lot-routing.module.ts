import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CocoonDetailsComponent } from './lot-management/cocoon-details/cocoon-details.component';
import { CocoonListComponent } from './lot-management/cocoon-list.component';
import { CocoonLotCRUDComponent } from './lot-management/cocoon-lot-crud/cocoon-lot-crud.component';

import { CocoonCRUDComponent } from './lot-management/cocoon-crud/cocoon-crud.component';
import { ApprovalListComponent } from './approval-management/approval-list/approval-list.component';
import { CocoonApprovalCRUDComponent } from './lot-management/cocoon-approval-crud/cocoon-approval-crud.component';

import { PayoutRequestComponent } from './payout-request/payout-request.component';


const routes: Routes = [
      { 
        path: '', 
        children:[
          { path: '', component: CocoonListComponent },
          // { path: 'crud', component: CocoonLotCRUDComponent },
          // { path: 'crud/:id', component: CocoonLotCRUDComponent },
          { path: 'details/:id', component: CocoonDetailsComponent},
          { path: 'crud', component: CocoonCRUDComponent },
          { path: 'crud/:id', component: CocoonCRUDComponent },
          { path:'approval-tickets', component:ApprovalListComponent},
          { path:'ticket/:id', component:CocoonApprovalCRUDComponent},
          {path:'payout-request',component:PayoutRequestComponent}


        ]
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CocoonLotRoutingModule { }
