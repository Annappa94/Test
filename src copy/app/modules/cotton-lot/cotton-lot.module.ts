import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CottonLotRoutingModule } from './cotton-lot-routing.module';
import { CottonLotListComponent } from './cotton-lot-list/cotton-lot-list.component';
import { SharedModule } from '../shared/shared.module';
import { CottonCrudComponent } from './cotton-crud/cotton-crud.component';
import { CottonLotDetailsComponent } from './cotton-lot-details/cotton-lot-details.component';
import { CottonListComponent } from './cotton-list/cotton-list.component';


@NgModule({
  declarations: [
    CottonListComponent,
    CottonCrudComponent,
    CottonLotDetailsComponent
  ],
  imports: [
    CommonModule,
    CottonLotRoutingModule,
    SharedModule
  ]
})
export class CottonLotModule { }
