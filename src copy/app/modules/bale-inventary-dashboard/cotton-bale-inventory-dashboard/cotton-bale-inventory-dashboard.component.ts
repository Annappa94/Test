import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators,  } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cotton-bale-inventory-dashboard',
  templateUrl: './cotton-bale-inventory-dashboard.component.html',
  styleUrls: ['./cotton-bale-inventory-dashboard.component.scss']
})
export class CottonBaleInventoryDashboardComponent implements OnInit {
  ManualCottonBaleInventoryForm:UntypedFormGroup;
  InventoryId : any;
  selectedWareHouseId : any;

  availableByID : any;
  inventoryDetailes: any;
  warehouseList: any = [];
   paginationData = {
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  };
  selectedStatus: any;
  TotalBaleInventoryDetailes: any;
  warehouseDetaisList: any;

  AvailableBaleDetails: any;

 
constructor (private modalService: NgbModal,
  private ngxLoader: NgxUiLoaderService,
  private _cd: ChangeDetectorRef,
  private api: ApiService,
  private toaster:ToastrService,
  private router: Router,

  private formBuilder: UntypedFormBuilder){
    this.selectedStatus = '';
    this.InventoryId = '';
    this.selectedWareHouseId = '';

  }
  

  ngOnInit(): void {
    this.invetoryList();
    this.getWarehouses();
    this.getSelectedWareHouseDetaisById();
  };
  createmanualebaleinventoryFormInit(){
    this.ManualCottonBaleInventoryForm = this.formBuilder.group({
      availableQuantity: new UntypedFormControl(''),
      availableQuantityInKg: new UntypedFormControl(''),
      requiredQuantity: new UntypedFormControl('',[Validators.required, CustomValidator.cannotContainOnlySpace]),
      requiredQuantityInKg: new UntypedFormControl('',[Validators.required, CustomValidator.cannotContainOnlySpace,Validators.min(1)]),
    });
  }
  async onChangeWareHouse(event) {
    this.paginationData.currentPage = 0;
    this.selectedStatus = event.target.value;
    console.log(this.selectedStatus);
    
    if (this.selectedStatus == undefined) {
      this.selectedStatus = ''
    }
    this.invetoryList();
  }
  invetoryList(){
    this.api.estimatedInventoryList(this.selectedStatus).then(response=>{
     this.inventoryDetailes=response;
     this._cd.detectChanges();
   
    })
  }
  availid:any;
  selectedwarehousename;

  async onChangeAvalibaleInventory(event) {
    this.paginationData.currentPage = 0;
    this.selectedWareHouseId = event.target.value;
    console.log("inventoryid",this.selectedWareHouseId);
    
    if (this.selectedWareHouseId == undefined) {
      this.selectedWareHouseId = ''
    }
    this.getSelectedWareHouseDetaisById();
    let selectedWarehouse = event.target.options[event.target.options.selectedIndex].text;
    this.selectedwarehousename = selectedWarehouse;

  }

  async getWarehouses() {
    this.ngxLoader.stop();
    this.api.getListOfWareHouses().then(details => {
      if (details) {
        this.warehouseList = details['content'];
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }
  //-----Every Details Coming From Single Api------------------------------------------
  getSelectedWareHouseDetaisById(){
    this.api.getManualCottonBaleLotDetails(this.selectedWareHouseId).then(response=>{
      this.warehouseDetaisList=response;
      this._cd.detectChanges();
      console.log("details", this.warehouseDetaisList)
    })
    this.ManualCottonBaleInventoryForm?.get('availableQuantity').patchValue(this.warehouseDetaisList?.availableQuantity),
    this.ManualCottonBaleInventoryForm?.get('availableQuantityInKg').patchValue(this.warehouseDetaisList?.availableWeight);
    
  }
  //---------------------------------------------
  
  //---------------AVAILABLE-INVENTORY-------------------------------------------------------------
  modalRef;
  closeResult: string;
  CbProductionPopup(cbproductionpopupcontent){
    this.modalRef = this.modalService.open(cbproductionpopupcontent)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
     this.createmanualebaleinventoryFormInit();
     
     this.ManualCottonBaleInventoryForm.get('requiredQuantity').setValidators([Validators.required,Validators.min(1),Validators.max(this.warehouseDetaisList?.availableQuantity),]);
     this.ManualCottonBaleInventoryForm.get('requiredQuantity').updateValueAndValidity();
     this.getSelectedWareHouseDetaisById();
  }
  closeAvailabilitypopup() {
    this.modalRef.close();
  }
  createManualcottonbaleProduction(){
    const params = {
      itemId : this.selectedWareHouseId,
      quantity : this.ManualCottonBaleInventoryForm.get('requiredQuantity').value,
      totalWeight : this.ManualCottonBaleInventoryForm.get('requiredQuantityInKg').value,  
    }
    this.api.createManualCottonBaleIventory(params).then(res => {
      this.closeAvailabilitypopup();
      this.router.navigate(['/resha-farms/cotton-bales/manufacture']);
    });
    
  }
  isControlValidForRequiredQuantity(controlName: string): boolean {
    const control = this.ManualCottonBaleInventoryForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForRequiredQuantity(controlName: string): boolean {
    const control = this.ManualCottonBaleInventoryForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForRequiredQuantity(validation, controlName): boolean {
    const control = this.ManualCottonBaleInventoryForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForRequiredQuantity(controlName): boolean {
    const control = this.ManualCottonBaleInventoryForm.controls[controlName];
    return control.dirty || control.touched;
  }
  
  
}
