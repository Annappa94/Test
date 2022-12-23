import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CottonLogisticRoutingModule } from './cotton-logistic-routing.module';
import { LogisticListComponent } from './logistic-list/logistic-list.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LogisticListComponent
  ],
  imports: [
    CommonModule,
    CottonLogisticRoutingModule,
    SharedModule
  ]
})
export class CottonLogisticModule { }
