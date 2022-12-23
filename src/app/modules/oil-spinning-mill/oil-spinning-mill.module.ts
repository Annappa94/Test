import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OilSpinningMillRoutingModule } from './oil-spinning-mill-routing.module';
import { OilSpinningMillCrudComponent } from './oil-spinning-mill-crud/oil-spinning-mill-crud.component';
import { OilSpinningMillListComponent } from './oil-spinning-mill-list/oil-spinning-mill-list.component';
import { OilSpinningMillDetailsComponent } from './oil-spinning-mill-details/oil-spinning-mill-details.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    OilSpinningMillCrudComponent,
    OilSpinningMillListComponent,
    OilSpinningMillDetailsComponent
  ],
  imports: [
    CommonModule,
    OilSpinningMillRoutingModule,
    SharedModule
  ]
})
export class OilSpinningMillModule { }
