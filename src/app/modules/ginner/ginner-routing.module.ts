import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GinnerCrudComponent } from './ginner-crud/ginner-crud.component';
import { GinnerDetailsComponent } from './ginner-details/ginner-details.component';
import { GinnerListComponent } from './ginner-list/ginner-list.component';

const routes: Routes = [
  {path:"",component:GinnerListComponent},
  { path:'crud',component:GinnerCrudComponent },
  { path:'crud/:id',component:GinnerCrudComponent },
  { path:'details/:id',component:GinnerDetailsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GinnerRoutingModule { }
