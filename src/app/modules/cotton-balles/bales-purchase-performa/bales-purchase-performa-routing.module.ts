import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalesPoCrudComponent } from './bales-po-crud/bales-po-crud.component';
import { BalesPoDetailsComponent } from './bales-po-details/bales-po-details.component';
import { BalesPoListComponent } from './bales-po-list/bales-po-list.component';

const routes: Routes = [
  {path:"",component:BalesPoListComponent},
  { path:'crud',component:BalesPoCrudComponent },
  { path:'crud/:id',component: BalesPoCrudComponent},
  { path:'details/:id',component: BalesPoDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalesPurchasePerformaRoutingModule { }
