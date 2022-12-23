import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { FarmerRoutingModule } from "./farmer.routing.module";
import { CocoonOrderForFarmerComponent } from "./farmers-management/cocoon-order-for-farmer/cocoon-order-for-farmer.component";
import { FarmerCRUDComponent } from "./farmers-management/farmer-crud/farmer-crud.component";
import { FarmerDetailsComponent } from "./farmers-management/farmer-detail/farmer-details.component";
import { FarmerKhataComponent } from "./farmers-management/farmer-khata/farmer-khata.component";
import { FarmersViewComponent } from "./farmers-management/farmers-view.component";
@NgModule({
  declarations: [
    FarmerCRUDComponent,
    FarmersViewComponent,
    FarmerDetailsComponent,
    FarmerKhataComponent,
    CocoonOrderForFarmerComponent,
    
  ],
  imports: [
    FarmerRoutingModule,
    SharedModule,
  ],
  exports: [
    FarmerRoutingModule,
  ]
})
export class FarmerModule {}
