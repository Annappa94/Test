import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarkSoldComponent } from '../cocoon-lot/lot-management/mark-sold/mark-sold.component';
import { CocoonOrderDetailsComponent } from './cocoon-order-details/cocoon-order-details.component';
import { CocoonOrdersComponent } from './cocoon-orders/cocoon-orders.component';

const routes: Routes = [
  { 
    path: '',
    children:[
      { path: '', component: CocoonOrdersComponent },
      { path: 'details/:id', component: CocoonOrderDetailsComponent },
      { path: 'crud', component: MarkSoldComponent },
      { path: 'crud/:id', component: MarkSoldComponent },
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CocoonOrderRoutingModule { }
