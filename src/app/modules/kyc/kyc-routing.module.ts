import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KycComponent } from './kyc/kyc.component';

const routes: Routes = [
  {
    path:'',
    children:[
      { path: '', component: KycComponent },
      { path: ':id/:parsonaType/:customerType', component: KycComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KycRoutingModule { }
