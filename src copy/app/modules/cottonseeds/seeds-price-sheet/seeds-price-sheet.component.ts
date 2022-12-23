import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SearchService } from 'src/app/services/api/search.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { ApiService } from 'src/app/services/api/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seeds-price-sheet',
  templateUrl: './seeds-price-sheet.component.html',
  styleUrls: ['./seeds-price-sheet.component.scss']
})
export class SeedsPriceSheetComponent implements OnInit {
  warehouseListArray: any[];
  candyRateCreationForm: UntypedFormGroup
  latestPriceSheet: any;
  editPricesheet: any;
  errorMessage: string;

  candyRateForm() {
    this.candyRateCreationForm = this.form.group({
      wareHouseList: new UntypedFormArray([]),
    })

  }
  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private toaster: ToastrService,
    private modalService: NgbModal,
    public globalService: GlobalService,
    private form: UntypedFormBuilder,
    private ngxLoader: NgxUiLoaderService,
    public util: UtilsService

  ) {
    this.editPricesheet = false;
    this.getWarehousePriceSheet();
    this.candyRateForm();
    this.getWarehouselist();
  }

  onVlueChange(i, type) {
    console.log(i);
    console.log(type);
    let warehouseName = this.candyRateCreationForm.get('wareHouseList')['controls'][i].get('warehouseName').value;
    let minPrice = parseInt(this.candyRateCreationForm.get('wareHouseList')['controls'][i].get('rmGradeAminPrice').value);
    let maxPrice = parseInt(this.candyRateCreationForm.get('wareHouseList')['controls'][i].get('rmGradeAmaxPrice').value);
    console.log(warehouseName);
    if (minPrice < maxPrice) {
      this.candyRateCreationForm.get('wareHouseList')['controls'][i].get('errorMessage').patchValue('');
      this.cdr.detectChanges();
    } else {
      let errorMessage = ' min price has to be less than max price';
      this.candyRateCreationForm.get('wareHouseList')['controls'][i].get('errorMessage').patchValue(errorMessage);
      this.cdr.detectChanges();
    }

  }

  getWarehousePriceSheet() {
    this.api.getPriceSheetOfWarehouse().then(response => {
      this.latestPriceSheet = response['content'];
      this.cdr.detectChanges();


    })
  }
  getWarehouselist() {
    this.api.getListOfWareHouses().then(response => {
      // this.warehouseListArray = response['content'];
      this.warehouseListArray = response['content'];
      this.warehouseListArray.forEach(item => {
        // (this.candyRateCreationForm.get('wareHouseList') as UntypedFormArray).push(new UntypedFormControl(item.name));
        (this.candyRateCreationForm.get('wareHouseList') as UntypedFormArray).push(new UntypedFormGroup({
          id: new UntypedFormControl(item.id),
          warehouseName: new UntypedFormControl(item.name),
          rmGradeAminPrice: new UntypedFormControl('0'),
          rmGradeAmaxPrice: new UntypedFormControl('0'),
          errorMessage:new UntypedFormControl(),
       }));
        this.cdr.detectChanges();
      })

    })
  }

  createCandyPriceSheet(value) {
    let params = value.wareHouseList;
    this.api.createSeedsPriceSheet(params).then(response => {
      this.editPricesheet = false;
      this.toaster.success('Created Price  Sheet successfully', 'Ok', {
        timeOut: 3000,
      })
      this.getWarehousePriceSheet();
    })

  }

  ShoweditPriceSheet() {
    this.editPricesheet = true;
  }

  ngOnInit(): void { }


}
