import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChawkiRoutingModule } from './chawki-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ChawkiDetailsComponent } from './chawki-management/chawki-details/chawki-details.component';
import { ChawkiCRUDComponent } from './chawki-management/chawki-crud/chawki-crud.component';
import { ChawkiViewComponent } from './chawki-management/chawki-view.component';
import { ChawkiBatchCrudComponent } from './chawki-management/chawki-batch-crud/chawki-batch-crud.component';
import { ChawkiOrderListingComponent } from './chawki-management/chawki-order-listing/chawki-order-listing.component';
import { ChawkiBatchListingComponent } from './chawki-management/chawki-batch-listing/chawki-batch-listing.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    ChawkiViewComponent,
    ChawkiCRUDComponent,
    ChawkiDetailsComponent,
    ChawkiBatchCrudComponent,
    ChawkiOrderListingComponent,
    ChawkiBatchListingComponent,
  ],
  imports: [
    CommonModule,
    ChawkiRoutingModule,
    SharedModule,
    PdfViewerModule
  ]
})
export class ChawkiModule { }