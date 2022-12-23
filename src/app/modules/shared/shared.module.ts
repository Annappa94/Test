import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgSelectModule } from '@ng-select/ng-select';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxCSVtoJSONModule } from 'ngx-csvto-json';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatDialogModule } from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BankFormComponent } from './bank-form/bank-form.component';
import { AddressPincodeFormComponent } from './address-pincode-form/address-pincode-form.component';
import { GenericPaymentComponent } from './generic-payment/generic-payment.component';
import { FetchButttonDynamicallyComponent } from './fetch-buttton-dynamically/fetch-buttton-dynamically.component';
import { ApproveOrRejectButtonComponent } from './approve-or-reject-button/approve-or-reject-button.component';
import { CamundaButtonComponent } from './camunda-button/camunda-button.component';
import { CottonOrderpaymentComponent } from './cotton-orderpayment/cotton-orderpayment.component';
import { InitializePaymentComponent } from './initialize-payment/initialize-payment.component';
import { MandateCancelComponent } from './mandate-cancel/mandate-cancel.component';
import { LoadingButtonComponent } from './loading-button/loading-button.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { AddressComponent } from './address/address.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { NoteLogsComponent } from './note-logs/note-logs.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { FollowupsCrudComponent } from './followup-crud/followups-crud.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { IndividualFollowUpComponent } from './individual-follow-up/individual-follow-up.component';
import { ChawkiComponent } from './dialog-models/chawki/chawki.component';
import { FarmerComponent } from './dialog-models/farmer/farmer.component';
import { FollowUpComponent } from './dialog-models/follow-up/follow-up.component';
import { ReelerComponent } from './dialog-models/reeler/reeler.component';
import { RetailerComponent } from './dialog-models/retailer/retailer.component';
import { TwistingUnitComponent } from './dialog-models/twisting-unit/twisting-unit.component';
import { WeaverComponent } from './dialog-models/weaver/weaver.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { KYCdetailsComponent } from './kycdetails/kycdetails.component';
import { SalesOrderBlockComponent } from '../sales-order-block-popup/sales-order-block-popup.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { TableComponent } from './table/table.component';
import { LowerCasePipe } from '@angular/common';
import { PaymentCocoonPurchaseKhataComponent } from './payment-cocoon-purchase-khata/payment-cocoon-purchase-khata.component';
import { RetailerDepositsComponent } from './retailer-deposit-payments/retailer-deposits/retailer-deposits.component';
import { PaginatedTableComponent } from './paginated-table/paginated-table.component';
import { TitleCasePipe } from '@angular/common';
import { CottonLotListComponent } from '../cotton-lot/cotton-lot-list/cotton-lot-list.component';
import { CottonOrderListComponent } from '../cotton-order/cotton-order-list/cotton-order-list.component';
import { BalesPoListComponent } from '../cotton-balles/bales-purchase-performa/bales-po-list/bales-po-list.component';
import { BalesPurchaseListComponent } from '../cotton-balles/bales-purchases/bales-purchase-list/bales-purchase-list.component';
import { BalesSalesListComponent } from '../cotton-balles/bales-sales-order/bales-sales-list/bales-sales-list.component';
import { PupaeLotListComponent } from './pupae-lot-list/pupae-lot-list.component';
import { PupaeOrderListingComponent } from './pupae-order-listing/pupae-order-listing.component';
import { CustomDatePickerComponent } from './custom-date-picker/custom-date-picker.component';
import { ApprovedSettlementsComponent } from './approved-settlements/approved-settlements/approved-settlements.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


import { ChartsModule } from 'ng2-charts';

FusionChartsModule.fcRoot(FusionCharts, Widgets, FusionTheme);

@NgModule({
  declarations: [
    BankFormComponent,
    PaginatedTableComponent,
    BackButtonComponent,
    AddressPincodeFormComponent,
    GenericPaymentComponent,
    NoteLogsComponent,
    FetchButttonDynamicallyComponent,
    ApproveOrRejectButtonComponent,
    CamundaButtonComponent,
    PaymentCocoonPurchaseKhataComponent,
    CottonOrderpaymentComponent,
    InitializePaymentComponent,
    MandateCancelComponent,
    LoadingButtonComponent,
    SafeHtmlPipe,
    AddressComponent,
    AddressFormComponent,
    FollowupsCrudComponent,
    CustomerDetailsComponent,
    IndividualFollowUpComponent,
    ChawkiComponent,
    FarmerComponent,
    FollowUpComponent,
    ReelerComponent,
    RetailerComponent,
    TwistingUnitComponent,
    WeaverComponent,
    ImageUploadComponent,
    KYCdetailsComponent,
    SalesOrderBlockComponent,
    TextEditorComponent,
    TableComponent,
    RetailerDepositsComponent,
    CottonLotListComponent,
    CottonOrderListComponent,
    BalesPoListComponent,
    BalesPurchaseListComponent,
    BalesSalesListComponent,
    PupaeLotListComponent,
    PupaeOrderListingComponent,
    CustomDatePickerComponent,
    ApprovedSettlementsComponent,
    
    
  ],
  imports: [
    
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbModule,
    NgbProgressbarModule,
    FormsModule,
    ReactiveFormsModule,
    CdkStepperModule,
    NgSelectModule,
    SlickCarouselModule,
    CarouselModule,
    MatRadioModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    MatToolbarModule,
    MatTabsModule,
    MatStepperModule,
    MatCheckboxModule,
    NgxCSVtoJSONModule,
    InlineSVGModule,
    MatDialogModule,
    PdfViewerModule,
    NgApexchartsModule,
    NgMultiSelectDropDownModule,
    ChartsModule,
    LowerCasePipe,
    TitleCasePipe,
    MatButtonToggleModule,
    MatFormFieldModule



  ],
  exports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbModule,
    NgbProgressbarModule,
    FormsModule,
    ReactiveFormsModule,
    CdkStepperModule,
    NgSelectModule,
    SlickCarouselModule,
    CarouselModule,
    MatRadioModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    MatToolbarModule,
    MatTabsModule,
    NgApexchartsModule,
    MatStepperModule,
    MatCheckboxModule,
    NgxCSVtoJSONModule,
    InlineSVGModule,
    MatDialogModule,
    PdfViewerModule,
    NgMultiSelectDropDownModule,
    ChartsModule,
    BankFormComponent,
    AddressPincodeFormComponent,
    GenericPaymentComponent,
    FetchButttonDynamicallyComponent,
    ApproveOrRejectButtonComponent,
    CamundaButtonComponent,
    CottonOrderpaymentComponent,
    InitializePaymentComponent,
    MandateCancelComponent,
    LoadingButtonComponent,
    AddressComponent,
    AddressFormComponent,
    NoteLogsComponent,
    BackButtonComponent,
    FollowupsCrudComponent,
    CustomerDetailsComponent,
    IndividualFollowUpComponent,
    ChawkiComponent,
    FarmerComponent,
    FollowUpComponent,
    ReelerComponent,
    RetailerComponent,
    TwistingUnitComponent,
    WeaverComponent,
    ImageUploadComponent,
    KYCdetailsComponent,
    TextEditorComponent,
    TableComponent,
    PaymentCocoonPurchaseKhataComponent,
    RetailerDepositsComponent,
    LowerCasePipe,
    PaginatedTableComponent,
    TitleCasePipe,
    CottonLotListComponent,
    CottonOrderListComponent,
    BalesPoListComponent,
    BalesPurchaseListComponent,
    BalesSalesListComponent,
    PupaeLotListComponent,
    PupaeOrderListingComponent,
    CustomDatePickerComponent,
    ApprovedSettlementsComponent,
    MatButtonToggleModule

    

  ]
})
export class SharedModule { }
