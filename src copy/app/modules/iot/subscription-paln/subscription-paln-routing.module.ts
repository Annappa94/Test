import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionPlanListComponent } from './subscription-plan-list/subscription-plan-list.component';
import { SubscriptionPlanCrudComponent } from './subscription-plan-crud/subscription-plan-crud.component';

const routes: Routes = [
  { 
    path: '', 
     children:[
      { path: '', component: SubscriptionPlanListComponent },
      { path: 'crud', component: SubscriptionPlanCrudComponent },
      { path: 'crud/:id', component: SubscriptionPlanCrudComponent },

     ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionPalnRoutingModule { }
