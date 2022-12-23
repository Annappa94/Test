import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OilSpinningMillCrudComponent } from './oil-spinning-mill-crud/oil-spinning-mill-crud.component';
import { OilSpinningMillDetailsComponent } from './oil-spinning-mill-details/oil-spinning-mill-details.component';
import { OilSpinningMillListComponent } from './oil-spinning-mill-list/oil-spinning-mill-list.component';

const routes: Routes = [
  {path:"",component:OilSpinningMillListComponent},
  { path:'crud',component:OilSpinningMillCrudComponent },
  { path:'crud/:id',component:OilSpinningMillCrudComponent },
  { path:'details/:id',component:OilSpinningMillDetailsComponent },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OilSpinningMillRoutingModule { }
