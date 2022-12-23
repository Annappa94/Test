import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TussarFarmerCrudComponent } from './tussar-farmer-crud/tussar-farmer-crud.component';
import { TussarFarmerDetailsComponent } from './tussar-farmer-details/tussar-farmer-details.component';
import { TussarFarmerListComponent } from './tussar-farmer-list/tussar-farmer-list.component';
import { TussarReelerCrudComponent } from './tussar-reeler-crud/tussar-reeler-crud.component';
import { TussarReelerDetailsComponent } from './tussar-reeler-details/tussar-reeler-details.component';
import { TussarReelerListComponent } from './tussar-reeler-list/tussar-reeler-list.component';
import { TussarLotCrudComponent } from './tussar-lot-crud/tussar-lot-crud.component';
import { TussarLotListComponent } from './tussar-lot-list/tussar-lot-list.component';
import { TussarLotDetaislComponent } from './tussar-lot-detaisl/tussar-lot-detaisl.component';
import { TussarOrderDetailsComponent } from './tussar-order-details/tussar-order-details.component';
import { TussarOrderListComponent } from './tussar-order-list/tussar-order-list.component';
import { TussarLotLogisticsComponent } from './tussar-lot-logistics/tussar-lot-logistics.component';
import { TussarLotMarkSoldComponent } from './tussar-lot-mark-sold/tussar-lot-mark-sold.component';
import { PaymentTussarPurchasesKhataComponent } from './payment-tussar-purchases-khata/payment-tussar-purchases-khata.component';
import { TussarListComponent } from './tussar-list/tussar-list.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {path:'tussar-farmer-crud', component:TussarFarmerCrudComponent},
      {path:'tussar-farmer-crud/:id', component:TussarFarmerCrudComponent},
      {path:'tussar-farmer-details/:id', component:TussarFarmerDetailsComponent},
      {path:'tussar-farmer-crud/:id', component:TussarFarmerCrudComponent},
      {path:'tussar-farmer-details', component:TussarFarmerDetailsComponent},
      {path:'tussar-farmer-list', component:TussarFarmerListComponent},
      {path:'tussar-reeler-crud',component:TussarReelerCrudComponent},
      {path:'tussar-reeler-crud/:id',component:TussarReelerCrudComponent},
      {path:'tussar-reeler-list',component:TussarReelerListComponent},
      {path:'tussar-reeler-details/:id',component:TussarReelerDetailsComponent},


      {path:'tussar-lot-crud', component:TussarLotCrudComponent},
      {path:'tussar-lot-crud/:id', component:TussarLotCrudComponent},
      {path:'tussar-lot-list',component:TussarLotListComponent},
      {path:'tussar-lot-details/:id',component:TussarLotDetaislComponent},
      {path:'tussar-order-details/:id',component:TussarOrderDetailsComponent},
      {path:'tussar-order-list',component:TussarOrderListComponent},
      {path:'tussar-lot-logistics',component:TussarLotLogisticsComponent},
      {path:'tussar-lot-mark-sold',component:TussarLotMarkSoldComponent},
      {path:'tussar-lot-mark-sold/:id',component:TussarLotMarkSoldComponent},
      {path:'tussar-purchases-khata',component:PaymentTussarPurchasesKhataComponent},
      {path:'tussar-list', component:TussarListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TussarRoutingModule { }
