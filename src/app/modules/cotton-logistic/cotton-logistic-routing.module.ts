import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogisticListComponent } from './logistic-list/logistic-list.component';

const routes: Routes = [
  {path:'',component:LogisticListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CottonLogisticRoutingModule { }
