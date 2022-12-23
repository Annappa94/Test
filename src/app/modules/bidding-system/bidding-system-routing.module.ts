import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableLayoutComponent } from './table-layout/table-layout.component';
import { WhLayoutCrudComponent } from './warehouse-layout/CRUD/wh-layout-crud/wh-layout-crud.component';
import { TableListingComponent } from './table-listing/table-listing.component';
import { WarehouseLayoutComponent } from './warehouse-layout/warehouse-layout/warehouse-layout.component';
import { AssignToBidComponent } from './assign-to-bid/assign-to-bid.component';
import { CBidListComponent } from './cocoon-bidding/bid-list/c-bid-list/c-bid-list.component';
import { BiddingCrudComponent } from './cocoon-bidding/bidding-crud/bidding-crud.component';
import { CocoonSplitingComponent } from './cocoon-spliting/cocoon-spliting.component';
import { LiveBiddingComponent } from './live-bidding/live-bidding.component';

const routes: Routes = [
  {
    path:'',
    children:[
      { path: 'table', component: TableListingComponent },
      { path: 'table-crud', component: TableLayoutComponent },
      { path: 'table-crud/:id', component: TableLayoutComponent },
      { path: 'table', component: TableLayoutComponent },
      { path: 'bid-list', component: CBidListComponent },
      { path: 'warehouse-layout', component: WarehouseLayoutComponent },
      { path: 'warehouse-layout-crud', component: WhLayoutCrudComponent },
      { path: 'warehouse-layout-crud/:id', component: WhLayoutCrudComponent },
      { path: 'assignToBid', component: AssignToBidComponent },
      { path: 'bidding-crud', component: BiddingCrudComponent },
      { path: 'bidding-crud/:id', component: BiddingCrudComponent },
      { path: 'cocoon-spliting', component: CocoonSplitingComponent },
      { path: 'live-bidding/:id/:status', component: LiveBiddingComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiddingSystemRoutingModule { }
