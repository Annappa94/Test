import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PupaeRoutingModule } from './pupae-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PupaeSupplierListComponent } from './supplier/list/pupae-supplier-list/pupae-supplier-list.component';
import { SupliersCrudComponent } from './supplier/crud/supliers-crud/supliers-crud.component';
import { SupplierDetailsComponent } from './supplier/details/supplier-details/supplier-details.component';


@NgModule({
  declarations: [
    PupaeSupplierListComponent,
    SupliersCrudComponent,
    SupplierDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PupaeRoutingModule,
  ]
})
export class PupaeModule { }
