import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmMarketplaceRoutingModule } from './farm-marketplace-routing.module';
import { FarmMarketPlaceCrudComponent } from './farm-market-place/farm-market-place-crud/farm-market-place-crud/farm-market-place-crud.component';
import { FarmMarketPlaceComponent } from './farm-market-place/farm-market-place/farm-market-place.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    FarmMarketPlaceCrudComponent,
    FarmMarketPlaceComponent,
  ],
  imports: [
    CommonModule,
    FarmMarketplaceRoutingModule,
    SharedModule
  ]
})
export class FarmMarketplaceModule { }
