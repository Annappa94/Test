import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCRUDComponent } from './user-management/user-crud/user-crud.component';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  {
    path:'',
    children:[
      { path: '', component: UserManagementComponent },
      { path: 'crud', component: UserCRUDComponent },
      { path: 'crud/:id', component: UserCRUDComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
