import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GinnerRoutingModule } from './ginner-routing.module';
import { GinnerCrudComponent } from './ginner-crud/ginner-crud.component';
import { SharedModule } from '../shared/shared.module';
import { GinnerListComponent } from './ginner-list/ginner-list.component';
import { GinnerDetailsComponent } from './ginner-details/ginner-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ContractComponent } from './contract/contract.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    GinnerCrudComponent,
    GinnerListComponent,
    GinnerDetailsComponent,
    ContractComponent,

  ],
  imports: [
    CommonModule,
    GinnerRoutingModule,
    SharedModule,
    PdfViewerModule,
    MatDatepickerModule,
    // use this if you want to use native javascript dates and INTL API if available
    // MatNativeDatetimeModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
  ]
})
export class GinnerModule { }
