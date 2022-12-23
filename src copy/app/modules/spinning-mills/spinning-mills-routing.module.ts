import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpinningMillsListComponent } from './spinning-mills-list/spinning-mills-list.component';
import { SpinningMillsCrudComponent } from './spinning-mills-crud/spinning-mills-crud.component';
import { SpinningDetailsComponent } from './spinning-details/spinning-details.component';


const routes: Routes = [
  {path:"",component:SpinningMillsListComponent},
  { path:'crud',component:SpinningMillsCrudComponent },
  { path:'crud/:id',component:SpinningMillsCrudComponent },
  { path:'details/:id',component:SpinningDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpinningMillsRoutingModule { }
