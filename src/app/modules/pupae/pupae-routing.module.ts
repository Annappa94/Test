import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupliersCrudComponent } from './supplier/crud/supliers-crud/supliers-crud.component';
import { SupplierDetailsComponent } from './supplier/details/supplier-details/supplier-details.component';
import { PupaeSupplierListComponent } from './supplier/list/pupae-supplier-list/pupae-supplier-list.component';

const routes: Routes = [
  { 
    path: '', 
    children:[
      { path: '', component: PupaeSupplierListComponent },
      { path: 'crud', component: SupliersCrudComponent },
      { path: 'crud/:id', component: SupliersCrudComponent },
      { path: 'details/:id', component: SupplierDetailsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PupaeRoutingModule { }
