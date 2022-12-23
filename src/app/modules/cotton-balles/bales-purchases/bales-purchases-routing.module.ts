import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalesPurchaseListComponent } from './bales-purchase-list/bales-purchase-list.component';
import { BalePurchasesCrudComponent } from './bale-purchases-crud/bale-purchases-crud.component';
import { BalePurchasesDetailsComponent } from './bale-purchases-details/bale-purchases-details.component';

const routes: Routes = [
  {path:"",component:BalesPurchaseListComponent},
  {path:"crud",component:BalePurchasesCrudComponent},
  {path:"crud/:id",component:BalePurchasesCrudComponent},
  
  // { path:'crud',component: },
  // { path:'crud/:id',component: },
  { path:'details/:id',component:BalePurchasesDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalesPurchasesRoutingModule { }
