import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { SubscriptionPalnRoutingModule } from './subscription-paln-routing.module';
import { SubscriptionPlanListComponent } from './subscription-plan-list/subscription-plan-list.component';
import { SubscriptionPlanCrudComponent } from './subscription-plan-crud/subscription-plan-crud.component';


@NgModule({
  declarations: [
    SubscriptionPlanListComponent,
    SubscriptionPlanCrudComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SubscriptionPalnRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class SubscriptionPalnModule { }
