import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { SpinningMillsRoutingModule } from './spinning-mills-routing.module';
import { SpinningMillsListComponent } from './spinning-mills-list/spinning-mills-list.component';
import { SpinningMillsCrudComponent } from './spinning-mills-crud/spinning-mills-crud.component';
import { SpinningDetailsComponent } from './spinning-details/spinning-details.component';


@NgModule({
  declarations: [
    SpinningMillsListComponent,
    SpinningMillsCrudComponent,
    SpinningDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SpinningMillsRoutingModule
  ]
})
export class SpinningMillsModule { }
