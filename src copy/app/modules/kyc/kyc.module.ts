import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KycRoutingModule } from './kyc-routing.module';
import { SharedModule } from '../shared/shared.module';
import { KycComponent } from './kyc/kyc.component';
import { KYCGenricComponentComponent } from './kyc/kycgenric-component/kycgenric-component.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    KycComponent,
    KYCGenricComponentComponent
  ],
  imports: [
    CommonModule,
    KycRoutingModule,
    SharedModule,
    PdfViewerModule
  ]
})
export class KycModule { }
