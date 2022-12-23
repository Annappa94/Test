import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalesProductionListComponent } from './bales-production-list/bales-production-list.component';

const routes: Routes = [
  {path:"",component:BalesProductionListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalesProductionRoutingModule { }
