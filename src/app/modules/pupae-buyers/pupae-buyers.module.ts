import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PupaeBuyersRoutingModule } from './pupae-buyers-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BuyersListComponent } from './buyers/list/buyers-list/buyers-list.component';
import { BuyersCrudComponent } from './buyers/crud/buyers-crud/buyers-crud.component';
import { BuyerDetailsComponent } from './buyers/details/buyer-details/supplier-details.component';


@NgModule({
  declarations: [
    BuyersListComponent,
    BuyersCrudComponent,
    BuyerDetailsComponent
  ],
  imports: [
    CommonModule,
    PupaeBuyersRoutingModule,
    SharedModule,
  ]
})
export class PupaeBuyersModule { }
