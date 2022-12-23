import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PupaeOrderDetailsComponent } from './pupae-order-details/pupae-order-details.component';
import { PupaeOrderComponent } from './pupae-order/pupae-order.component';
import { PupaeOrderListingComponent } from '../shared/pupae-order-listing/pupae-order-listing.component';

const routes: Routes = [
  { path:'',component:PupaeOrderListingComponent},
  { path:'crud',component:PupaeOrderComponent},
  { path:'crud/:id',component:PupaeOrderComponent},
  { path:'details/:id',component:PupaeOrderDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PupaeOrderRoutingModule { }
