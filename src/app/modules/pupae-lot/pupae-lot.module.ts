import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PupaeLotRoutingModule } from './pupae-lot-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PupaeLotCrudComponent } from './pupae-lot-crud/pupae-lot-crud.component';
import { PupaeLotDetailsComponent } from './pupae-lot-details/pupae-lot-details.component';


@NgModule({
  declarations: [
    PupaeLotCrudComponent,
    PupaeLotDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PupaeLotRoutingModule
  ]
})
export class PupaeLotModule { }
