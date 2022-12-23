import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChawkiOrderCRUDComponent } from './chawki-orders/chawki-order-crud/chawki-order-crud.component';
import { ChawkiOrderDetailsComponent } from './chawki-orders/chawki-order-details/chawki-order-details.component';
import { ChawkiOrdersComponent } from './chawki-orders/chawki-orders.component';

const routes: Routes = [
  {
    path: '',
    children:[
       { path: '', component: ChawkiOrdersComponent},
       { path: 'details', component: ChawkiOrderDetailsComponent },
       { path: 'details/:id', component: ChawkiOrderDetailsComponent },
       { path: 'crud', component: ChawkiOrderCRUDComponent },
       { path: 'crud/:id', component: ChawkiOrderCRUDComponent },
    ]   
 },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChawkiOrderRoutingModule { }
