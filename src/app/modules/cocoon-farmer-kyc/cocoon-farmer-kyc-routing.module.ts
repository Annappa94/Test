import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmerKycComponent } from './farmer-kyc/farmer-kyc.component';

const routes: Routes = [
  {path:"",component:FarmerKycComponent},
  { path: ':id/:parsonaType/:customerType', component: FarmerKycComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CocoonFarmerKycRoutingModule { }
