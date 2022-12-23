import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserCRUDComponent } from './user-management/user-crud/user-crud.component';
import { SharedModule } from '../shared/shared.module';
import { UserManagementComponent } from './user-management/user-management.component';


@NgModule({
  declarations: [
    UserManagementComponent,
    UserCRUDComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
