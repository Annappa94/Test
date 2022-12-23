import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CocoonFarmerListComponent } from './cocoon-farmer-list/cocoon-farmer-list.component';
import { CocoonFarmerCrudComponent } from './cocoon-farmer-crud/cocoon-farmer-crud.component';
import { CocoonFarmerDetailsComponent } from './cocoon-farmer-details/cocoon-farmer-details.component';

const routes: Routes = [
  {path:"",component:CocoonFarmerListComponent},
  { path:'crud',component:CocoonFarmerCrudComponent },
  { path:'crud/:id',component: CocoonFarmerCrudComponent},
  { path:'details/:id',component: CocoonFarmerDetailsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CocoonFarmerRoutingModule { }
