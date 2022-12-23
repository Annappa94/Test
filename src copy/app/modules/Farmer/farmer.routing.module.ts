import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { FarmerCRUDComponent } from './farmers-management/farmer-crud/farmer-crud.component';
import { FarmerDetailsComponent } from './farmers-management/farmer-detail/farmer-details.component';
import { FarmersViewComponent } from './farmers-management/farmers-view.component';

const routes: Routes = [
    { 
       path: '', 
       children:[
         { path: '', component: FarmersViewComponent },
         { path: 'crud', component: FarmerCRUDComponent },
         { path: 'crud/:id', component: FarmerCRUDComponent },
         { path: 'details/:id', component: FarmerDetailsComponent },
         
        ]
    },
];

@NgModule({
  imports: [ RouterModule.forChild(routes),
],
  exports: [
  ],
  declarations:[],
})
export class FarmerRoutingModule {}
