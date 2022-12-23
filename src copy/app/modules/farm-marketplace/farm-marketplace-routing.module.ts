import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FarmMarketPlaceCrudComponent } from './farm-market-place/farm-market-place-crud/farm-market-place-crud/farm-market-place-crud.component';
import { FarmMarketPlaceComponent } from './farm-market-place/farm-market-place/farm-market-place.component';

const routes: Routes = [
  {
    path:"",
    children:[
      { path: '', component: FarmMarketPlaceComponent},
      { path: 'crud', component: FarmMarketPlaceCrudComponent },
      { path: 'crud/:id', component: FarmMarketPlaceCrudComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmMarketplaceRoutingModule { }
