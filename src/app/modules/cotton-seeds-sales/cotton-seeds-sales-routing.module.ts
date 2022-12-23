import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CottonSeedsCrudComponent } from './cotton-seeds-crud/cotton-seeds-crud.component';
import { SeedsOrderCrudComponent } from './seeds-order-crud/seeds-order-crud.component';
import { SeedsSalesPurchaseListComponent } from './seeds-sales-purchase-list/seeds-sales-purchase-list.component';

const routes: Routes = [
  { path: '', component: SeedsSalesPurchaseListComponent },  
    { path: 'crud', component: CottonSeedsCrudComponent }, 
    { path:'crud/:id',component:CottonSeedsCrudComponent},
    { path:'seedsOrder',component:SeedsOrderCrudComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CottonSeedsSalesRoutingModule { }
