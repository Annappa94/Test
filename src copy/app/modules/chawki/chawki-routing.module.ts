import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChawkiCRUDComponent } from './chawki-management/chawki-crud/chawki-crud.component';
import { ChawkiDetailsComponent } from './chawki-management/chawki-details/chawki-details.component';
import { ChawkiViewComponent } from './chawki-management/chawki-view.component';
const routes: Routes = [
      { 
        path: '', 
        children:[
          { path: '', component: ChawkiViewComponent },
          { path: 'crud', component: ChawkiCRUDComponent},
          { path: 'crud/:id', component: ChawkiCRUDComponent },
          { path: 'details/:id', component: ChawkiDetailsComponent },
          { path: 'details', component: ChawkiDetailsComponent },
        ] 
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChawkiRoutingModule { }
