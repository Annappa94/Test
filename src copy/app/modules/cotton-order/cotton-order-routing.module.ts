import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CottonOrderDetailsComponent } from './cotton-order-details/cotton-order-details.component';
import { CottonOrderListComponent } from './cotton-order-list/cotton-order-list.component';
import { CottonOrderMarkSoldComponent } from './cotton-order-mark-sold/cotton-order-mark-sold.component';

const routes: Routes = [
  { path:'', component:CottonOrderListComponent },
  { path:'crud',component:CottonOrderMarkSoldComponent},
  { path:'crud/:id',component:CottonOrderMarkSoldComponent},
  { path:'details/:id',component:CottonOrderDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CottonOrderRoutingModule { }
