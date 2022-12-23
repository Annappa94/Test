import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CocoonFarmerKycRoutingModule } from './cocoon-farmer-kyc-routing.module';
import { FarmerKycComponent } from './farmer-kyc/farmer-kyc.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    FarmerKycComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CocoonFarmerKycRoutingModule,
    PdfViewerModule
  ]
})
export class CocoonFarmerKycModule { }
