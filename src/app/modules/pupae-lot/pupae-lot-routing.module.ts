import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PupaeLotCrudComponent } from './pupae-lot-crud/pupae-lot-crud.component';
import { PupaeLotDetailsComponent } from './pupae-lot-details/pupae-lot-details.component';
import { PupaeLotListComponent } from '../shared/pupae-lot-list/pupae-lot-list.component';

const routes: Routes = [
  { path:'', component:PupaeLotListComponent},
  { path:'details/:id', component:PupaeLotDetailsComponent},
  { path:'crud', component:PupaeLotCrudComponent},
  { path:'crud/:id', component:PupaeLotCrudComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PupaeLotRoutingModule { }
