import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CottonCrudComponent } from './cotton-crud/cotton-crud.component';
import { CottonLotDetailsComponent } from './cotton-lot-details/cotton-lot-details.component';
import { CottonLotListComponent } from './cotton-lot-list/cotton-lot-list.component';
import { CottonListComponent } from './cotton-list/cotton-list.component';

const routes: Routes = [
  { path:'',component:CottonListComponent},
  { path:'crud',component:CottonCrudComponent},
  { path:'crud/:id',component:CottonCrudComponent},
  { path:'details/:id',component:CottonLotDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CottonLotRoutingModule { }
