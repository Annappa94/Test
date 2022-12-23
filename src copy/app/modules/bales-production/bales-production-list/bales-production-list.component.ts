import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { SearchService } from 'src/app/services/api/search.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidator } from '../../shared/custom-validator/custom.validator';
@Component({
  selector: 'app-bales-production-list',
  templateUrl: './bales-production-list.component.html',
  styleUrls: ['./bales-production-list.component.scss']
})
export class BalesProductionListComponent implements OnInit {
  modalRef: any;
  closeResult: string;
  paginationData = {
    currentPage: 0,
    pageSize: 10,
    total: 0,
    pages: [],
    currentColumn: 'createdDate',
    currentDirection: 'desc',
  };
  getAllProductionList: any;
  ginnerData: any;
  selectedGinner: any;
  totalvalue: any
  baleListWeights: any[];
  disableToSave: any;
  productionBaleList: any;
  SlectedProductionItem: any;
  NoOfProductionLines: any;
  productionLineArray: any[];
  selectedProductionLine;
  userType: any;


  constructor(
    private api: ApiService,
    private apiSearch: SearchService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.userType = JSON.parse(localStorage.getItem('_ud'));
    // this.balesProductionCreateform=new UntypedFormGroup({
    //   numberOfBales:new FormControl(0),
    //   rowsArray: this.fb.array([this.rowsArrayController()]),
    // })
    this.disableToSave = true;
    this.getBaleListOfProductions();

  }
  formGroup:UntypedFormGroup = new UntypedFormGroup({
    ginnerList:new UntypedFormControl('',[Validators.required])
  })

  ngOnInit(): void {
    this.listenForThenumberOfBales();

  }
  async onPageChange(page) {
    this.paginationData.currentPage = page;


  }

  getBaleListOfProductions() {
    this.apiSearch.getBaleProductionList(this.paginationData).then(response => {
      console.log(response);
      this.productionBaleList = response;
      this._cd.detectChanges();

    })
  }


  getGinnerList(event) {
    if (event.term.length % 2 == 0) {
      let searchParams = `(name==*${event.term.replace(/ /gi, "*")}* or phone==*${event.term.replace(/ /gi, "*")}*)`;
      // this.apiSearch.getOrdersCotton(false, 'ginner',searchParams).then(res => {
      //   this.ginnerData = res['content'];
      this.api.getAllActiveContractGinners().then(res => {
        this.ginnerData = res;
        console.log(this.ginnerData);

        this._cd.detectChanges();
      })
    }
    if (!event.term || event.term.length == 0) {
      this.ginnerData = [];
      this._cd.detectChanges();
    }
  }

  sartProcess(baleprocess) {
    this.selectedGinner = "";
    this.modalRef = this.modalService.open(baleprocess)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  
  }

  startBaleProduction() {
    console.log(this.selectedGinner);
    let parms = {
      "ginner": "/ginner/" + this.selectedGinner?.id,
      "productionLineNo": 1
    }
    this.api.startCottonBaleProduction(parms).then(response => {
      console.log(response);
      this.modalRef.close();
      this.toaster.success('Production started Successfully', 'Bale Production', {
        timeOut: 3000
      });
      this.getBaleListOfProductions();

    })

  }

  endTheProcess(item) {
    console.log(item);
    this.SlectedProductionItem = item;
    this.endBaleProduction();
  }

  endBaleProduction() {
    let params = {
      "variables": {
        "requestId": {
          "value": this.SlectedProductionItem?.workflowTasks?.id,
          "type": "String"
        },
        "status": {
          "value": "approved",
          "type": "String"
        },
        "externalId": {
          "value": (this.SlectedProductionItem?.id).toString(),
          "type": "String"
        }
      }
    }
    this.api.endCottonBaleProduction(params).then(response => {
      console.log(response);
      this.toaster.success('Your Production Process Ended. Record Bales To Complete The Process', 'Bale Production', {
        timeOut: 3000
      });
      this.getBaleListOfProductions();
      this._cd.detectChanges();

    })
  }


  listenForThenumberOfBales() {
    this.balesProductionCreateform.get('numberOfBales').valueChanges.subscribe(res => {
      this.totalvalue = 0;
      this.baleListWeights = [];
      (this.balesProductionCreateform.get("rowsArray") as UntypedFormArray).clear()
      for (let i = 0; i < res; i++)
        this.addrowsArrayIndex();
    })
  }

  balesProductionCreateform = new UntypedFormGroup({
    numberOfBales: new FormControl('',[Validators.required]),
    rowsArray: this.fb.array([this.rowsArrayController()]),
  })
  rowsArrayController() {
    return this.fb.group({
      row: [0]
    })

  }

  OnchangeInputValue() {
    const baleKgs = this.balesProductionCreateform.controls.rowsArray as UntypedFormArray;
    this.totalvalue = 0;
    this.baleListWeights = [];
    baleKgs.value.forEach(ele => {
      this.totalvalue += parseFloat(ele.row);
      this.baleListWeights.push({ "baleWeight": ele.row })
      this._cd.detectChanges();
    })
    console.log(this.baleListWeights);

    if (this.baleListWeights.some(item => (item.baleWeight === 0 || item.baleWeight === null))) {
      this.disableToSave = true;
    } else {
      this.disableToSave = false;
    }
  }

  recordBalesData(bales, item) {
    this.SlectedProductionItem = item;
    this.rowsArrayController();
    this.balesProductionCreateform.get("numberOfBales")?.patchValue('')
    this.modalRef = this.modalService.open(bales)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  addrowsArrayIndex() {
    (this.balesProductionCreateform.get("rowsArray") as UntypedFormArray).push(this.rowsArrayController())
  }
  removerowsArrayIndex(rowsArrayIndex) {
    (this.balesProductionCreateform.get("rowsArray") as UntypedFormArray).removeAt(rowsArrayIndex);
  }

  recordBalesToEndProduction() {
    let reqObj = {
      "requestId": this.SlectedProductionItem?.workflowTasks?.id,
      "itemId": this.SlectedProductionItem?.id,
      "quantity": this.balesProductionCreateform.value.numberOfBales,
      "weight" :this.baleListWeights,
      "totalWeight": parseFloat(this.totalvalue),
    
    }
    console.log('reqObj==>', reqObj);
    this.api.recordBaleWeights(reqObj).then(response => {
      console.log(response);
      this.modalRef.close();
      this.getBaleListOfProductions()
      this.toaster.success('Bales Recorded Successfully', 'Bale Production', {
        timeOut: 3000
      });

    })
  }

  async onPageSizeChange() {
    this.getBaleListOfProductions()
  }

  onChangeGinner(data) {
    console.log(data);
    this.productionLineArray = [];
    if (data?.contractDetail) {
      this.NoOfProductionLines = data?.contractDetail?.productionLineUsed;
      for (let i = 0; i < this.NoOfProductionLines; i++) {
        this.productionLineArray.push(i)
      }
      console.log(this.productionLineArray);

    } else {
      this.NoOfProductionLines = 0;
    }

  }
  onchangeProdctionLine(event) {
    this.selectedProductionLine = event + 1
    console.log(this.selectedProductionLine);


  }



}
