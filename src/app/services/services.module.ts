import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api/api.service';
import { GlobalService } from './global/global.service';
import { UtilsService } from './utils/utils.service';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],

  providers: [
    ApiService,
    UtilsService,
    GlobalService,
  ]
})
export class ServicesModule { }
