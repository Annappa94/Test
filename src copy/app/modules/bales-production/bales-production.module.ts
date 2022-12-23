import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalesProductionRoutingModule } from './bales-production-routing.module';
import { BalesProductionListComponent } from './bales-production-list/bales-production-list.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    BalesProductionListComponent
  ],
  imports: [
    CommonModule,
    BalesProductionRoutingModule,
    SharedModule
  ]
})
export class BalesProductionModule { }
