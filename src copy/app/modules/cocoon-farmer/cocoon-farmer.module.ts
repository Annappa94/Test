import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";

import { CocoonFarmerRoutingModule } from './cocoon-farmer-routing.module';
import { CocoonFarmerListComponent } from './cocoon-farmer-list/cocoon-farmer-list.component';
import { CocoonFarmerCrudComponent } from './cocoon-farmer-crud/cocoon-farmer-crud.component';
import { CocoonFarmerDetailsComponent } from './cocoon-farmer-details/cocoon-farmer-details.component';
import { FarmerKhataComponent } from "./farmer-khata/farmer-khata.component";
import { CocoonOrderForFarmerComponent } from "./cocoon-order-for-farmer/cocoon-order-for-farmer.component";


@NgModule({
  declarations: [
    CocoonFarmerListComponent,
    CocoonFarmerCrudComponent,
    CocoonFarmerDetailsComponent,
    FarmerKhataComponent,
    CocoonOrderForFarmerComponent
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    CocoonFarmerRoutingModule
  ]
})
export class CocoonFarmerModule { }
