import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TussarRoutingModule } from './tussar-routing.module';
import { TussarFarmerCrudComponent } from './tussar-farmer-crud/tussar-farmer-crud.component';
import { TussarFarmerDetailsComponent } from './tussar-farmer-details/tussar-farmer-details.component';
import { TussarFarmerListComponent } from './tussar-farmer-list/tussar-farmer-list.component';
import { FarmerKhataComponent } from './farmer-khata/farmer-khata.component';
import { CocoonOrderForFarmerComponent } from './cocoon-order-for-farmer/cocoon-order-for-farmer.component';
import { TussarReelerCrudComponent } from './tussar-reeler-crud/tussar-reeler-crud.component';
import { TussarReelerListComponent } from './tussar-reeler-list/tussar-reeler-list.component';
import { TussarReelerDetailsComponent } from './tussar-reeler-details/tussar-reeler-details.component';
import { CocoonPurchaseKhataComponent } from './cocoon-purchase-khata/cocoon-purchase-khata.component';
import { YarnSellingKhataComponent } from './yarn-selling-khata/yarn-selling-khata.component';
import { TussarLotCrudComponent } from './tussar-lot-crud/tussar-lot-crud.component';
import { TussarLotListComponent } from './tussar-lot-list/tussar-lot-list.component';
import { SharedModule } from '../shared/shared.module';
import { TussarLotDetaislComponent } from './tussar-lot-detaisl/tussar-lot-detaisl.component';
import { TussarOrderListComponent } from './tussar-order-list/tussar-order-list.component';
import { TussarOrderDetailsComponent } from './tussar-order-details/tussar-order-details.component';
import { TussarLotLogisticsComponent } from './tussar-lot-logistics/tussar-lot-logistics.component';
import { TussarLotMarkSoldComponent } from './tussar-lot-mark-sold/tussar-lot-mark-sold.component';
import { PaymentTussarPurchasesKhataComponent } from './payment-tussar-purchases-khata/payment-tussar-purchases-khata.component';
import { TussarListComponent } from './tussar-list/tussar-list.component';


@NgModule({
  declarations: [
    TussarFarmerCrudComponent,
    TussarFarmerDetailsComponent,
    TussarFarmerListComponent,
    FarmerKhataComponent,
    CocoonOrderForFarmerComponent,
    TussarReelerCrudComponent,
    TussarReelerListComponent,
    TussarReelerDetailsComponent,
    CocoonPurchaseKhataComponent,
    YarnSellingKhataComponent,

    
    
    TussarLotCrudComponent,
    TussarLotListComponent,
    TussarLotDetaislComponent,
    TussarOrderListComponent,
    TussarOrderDetailsComponent,
    TussarLotLogisticsComponent,
    TussarLotMarkSoldComponent,
    PaymentTussarPurchasesKhataComponent,
    TussarListComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    TussarRoutingModule
  ]
})
export class TussarModule { }
