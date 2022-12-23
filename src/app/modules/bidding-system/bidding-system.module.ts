import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiddingSystemRoutingModule } from './bidding-system-routing.module';
import { TableLayoutComponent } from './table-layout/table-layout.component';
import { SharedModule } from '../shared/shared.module';
import { WarehouseLayoutComponent } from '././warehouse-layout/warehouse-layout/warehouse-layout.component';
import { TableTxLayoutComponent } from './table-tx-layout/table-tx-layout.component';
import { WhLayoutCrudComponent } from './warehouse-layout/CRUD/wh-layout-crud/wh-layout-crud.component';
import { TableListingComponent } from './table-listing/table-listing.component';
import { AssignToBidComponent } from './assign-to-bid/assign-to-bid.component';
import { CBidListComponent } from './cocoon-bidding/bid-list/c-bid-list/c-bid-list.component';
import { BiddingCrudComponent } from './cocoon-bidding/bidding-crud/bidding-crud.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { CocoonSplitingComponent } from './cocoon-spliting/cocoon-spliting.component';
import { LiveBiddingComponent } from './live-bidding/live-bidding.component';
// import { MatDatetimepickerModule } from '@angular/material-moment-adapter';
import { AngularFireModule } from "@angular/fire/compat";

export const environment = {
  firebase: {
    apiKey: "AIzaSyBnjpfk-fgol9oWelptPHTilJivJ4DNEdM",
    authDomain: "explore-d5262.firebaseapp.com",
    databaseURL: "https://explore-d5262-default-rtdb.firebaseio.com",
    projectId: "explore-d5262",
    storageBucket: "explore-d5262.appspot.com",
    messagingSenderId: "195135724941",
    appId: "1:195135724941:web:2801c8f322f8387c37b1c4",
    measurementId: "G-7ZF3JDJ4YX"
  }
};

@NgModule({
  declarations: [
    TableLayoutComponent,
    TableTxLayoutComponent,
    TableListingComponent,
    WarehouseLayoutComponent,
    TableTxLayoutComponent,
    WhLayoutCrudComponent,
    AssignToBidComponent,
    AssignToBidComponent,
    CBidListComponent,
    BiddingCrudComponent,
    CocoonSplitingComponent,
    LiveBiddingComponent
  ],
  imports: [
    CommonModule,
    BiddingSystemRoutingModule,
    SharedModule,
    MatDatepickerModule,
    // use this if you want to use native javascript dates and INTL API if available
    // MatNativeDatetimeModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    // MatNativeDatetimeModule,
    // MatDatetimepickerModule,
  ]
})
export class BiddingSystemModule { }
