import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyersCrudComponent } from './buyers/crud/buyers-crud/buyers-crud.component';
import { BuyerDetailsComponent } from './buyers/details/buyer-details/supplier-details.component';
import { BuyersListComponent } from './buyers/list/buyers-list/buyers-list.component';

const routes: Routes = [
  { 
    path: '', 
    children:[
      { path: '', component: BuyersListComponent },
      { path: 'crud', component: BuyersCrudComponent },
      { path: 'crud/:id', component: BuyersCrudComponent },
      { path: 'details/:id', component: BuyerDetailsComponent },
    ]
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PupaeBuyersRoutingModule { }
