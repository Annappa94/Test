import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AllDevices, Device } from 'src/app/model/Iot/iotDevice.model';
import { ApiService } from 'src/app/services/api/api.service';
import * as _moment from 'moment';
import { GlobalService } from 'src/app/services/global/global.service';
import { FollowUpComponent } from 'src/app/modules/shared/dialog-models/follow-up/follow-up.component';

@Component({
  selector: 'app-subscription-plan-crud',
  templateUrl: './subscription-plan-crud.component.html',
  styleUrls: ['./subscription-plan-crud.component.scss']
})
export class SubscriptionPlanCrudComponent implements OnInit {
  subscriptionPlanForm: UntypedFormGroup;
  dropdownSettings = {};
  centersList:any[];
  selectedItems: any[];



  formErrors = {
    "name":'',
    "businessVertical":'',
    "deviceTypeId"  : '',
    "productType":'',
    "applicableCenters":'',
    "recurringFrequency":'',
    "tenure"  :'',
    "depositAmount" : '',
    "recurringAmount" :'',
    "gracePeriod" :'',
    "paymentdate":'',
    "serviceType":''

  };
  // Form Error Object
  validationMessages = {
   "name": {
      'required':'Please enter Name',
    },
    "businessVertical": {
      'required':'Please Select Bussiness Vertical'
    },
    "deviceTypeId": {
      'required':'Please Select Device Type'
    },
    "productType": {
      'required':'Please Select Product Type'
    },
    "applicableCenters": {
      'required':'Please Select Atleast One center'
    },
    "serviceType" : {
      'required':'Please Select Atleast One Service Type'
    },
    "recurringFrequency" : {
      'required':'Please Enter Valid Recurring Frequency'
    },
    "tenure" : {
      'required':'Please Enter valid tenure'
    },
    "depositAmount" : {
      'required':'Please Enter valid Deposit Amount'
    },
    "recurringAmount" : {
      'required':'Please Enter valid recurring amount'
    }
  };
  centerList: any[];
  deviceTypeList: any;
  deviceTypeCode: any;
  datalist: any;
  subPlanId: any;
  subPlan: any;
  selectedDeviceType: any;
  selectedService: any;
  deviceTypeId: any;
 
 
  PlansInitForm() {
    // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.subscriptionPlanForm = this.form.group({
     name:['',[Validators.required]],
     businessVertical:['',[Validators.required]],
     deviceTypeId  : ['',[Validators.required]],
     productType:['',[Validators.required]],
     serviceApplicable:[''],
     applicableCenters:[[]],
     recurringFrequency:['', [Validators.required]],
     tenure  :['', [Validators.required]],
     depositAmount : ['', [Validators.required]],
     recurringAmount :['', [Validators.required]],
     gracePeriod :[],
     paymentdate:['05'],
    
 
    });
 
 
    this.subscriptionPlanForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }
 
  // Reactive form Error Detection
  onValueChanged(data?: any) {
    if (!this.subscriptionPlanForm) { return; }
    const form = this.subscriptionPlanForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          let msg = messages[key] ? messages[key] : '';
          this.formErrors[field] += msg + ' ';
        }
      }
 
    }
 
  }
 
  onSubmit() {
   if(!this.subscriptionPlanForm.valid){
     console.log("Form Is not Valid-------->");
     console.log(this.formErrors);
     if (!this.subscriptionPlanForm) { return; }
     const form = this. subscriptionPlanForm;
     for (const field in this.formErrors) {
   
       // clear previous error message (if any)
       this.formErrors[field] = '';
       const control = form.get(field);
       if (control && !control.valid) {
         const messages = this.validationMessages[field];
         for (const key in control.errors) {
           this.formErrors[field] += messages[key] + ' ';
         }
       }
     }
   }
    if(this.subscriptionPlanForm.valid){
      console.log("i am here");
      
        if(!this.selectedItems.length){
          const messages = this.validationMessages['applicableCenters'];
          const form = this. subscriptionPlanForm;
          const control = form.get('applicableCenters');
          this.formErrors['applicableCenters'] += messages['required'] + ' ';
        }else if(!this.selectedService){
          const messages = this.validationMessages['serviceType'];
          const form = this. subscriptionPlanForm;
          const control = form.get('serviceType');
          this.formErrors['serviceType'] += messages['required'] + ' ';
        }else{
          console.log("Form Is Valid-------->");
          console.log(this.formErrors);
          console.log(this.subscriptionPlanForm.value);
          let reqOBJ = {
           "name": this.subscriptionPlanForm.value.name,
           "deviceTypeId":  this.deviceTypeId,
           "tenure": this.subscriptionPlanForm.value.tenure,
           "depositAmount": this.subscriptionPlanForm.value.depositAmount,
           "recurringAmount": this.subscriptionPlanForm.value.recurringAmount,
           "gracePeriod": this.subscriptionPlanForm.value.gracePeriod,
           "applicableCenters": this.selectedItems,
           "serviceType": this.selectedService
          }
          this.api.createSubscriptionPlan(reqOBJ).then(res => {
           //console.log(res);
           this.router.navigate(['/resha-farms/iot/subscription']);
          })
        }
    }
 
  }

  constructor(
    private form:UntypedFormBuilder,
    private api:ApiService,
    private modalService:NgbModal,
    private _cd: ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private snackBar:MatSnackBar,
    private router:Router,
    private activatedRouter:ActivatedRoute,
    private global:GlobalService
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'centerName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      enableCheckAll: true,
      allowSearchFilter: true
    };
    // this.subPlanId=this.activatedRouter.snapshot.paramMap.get('id');
    // if (this.subPlanId) {
    //   this.getSubscriptionPlan();
    // }
    
  }
    onItemSelect(item: any) {
      // console.log(item);
      console.log( this.selectedItems);
      this.formErrors['applicableCenters'] = ' ';
      this._cd.detectChanges();
    }
    onSelectAll(items: any) {
      console.log(items);    
      this.formErrors['applicableCenters'] = ' ';
      this._cd.detectChanges();
    }

    ngOnInit(): void {
      this.PlansInitForm();
      this.selectedItems = [];
      this.getCenters();
      this.getDeviceTypeName();
    }
  // getSubscriptionPlan(){
  //   this.api.getSubsciptionPlan( this.subPlanId).then(res => {
  //     console.log(res);
  //     this.subPlan = res;
  //     this.subscriptionPlanForm.patchValue(this.subPlan);
  //     this._cd.detectChanges();
  //   })
  // }

  async getCenters() {
    this.api.getCentersList().then(details => {
      this.centerList = [];
      if (details) {
        this.datalist = details['_embedded']['center'];
        this.centerList = [];
        this.datalist.forEach(element => {
          this.centerList.push({
            id : parseInt(element.id),
            centerName: element.centerName
          })
        });
        
        console.log(this.centerList);
        
      }
      this._cd.detectChanges();
    }, err => {
    });
  }

  getDeviceTypeName(){
    this.api.getALLDeviceTypes().then(res=>{
      this.deviceTypeList = res['_embedded']['devicetype'];
      console.log(res['_embedded']);
      
      this._cd.detectChanges();
    })
  }

  getDeviuceTypeDataById(eventdata){
    this.deviceTypeId =eventdata.id;
    this.selectedDeviceType = eventdata;
    this.subscriptionPlanForm.get('deviceTypeId').patchValue( this.deviceTypeId);
    this.subscriptionPlanForm.get('businessVertical').patchValue( this.selectedDeviceType.businessVertical);
    this.subscriptionPlanForm.get('productType').patchValue( this.selectedDeviceType.productType);
    this._cd.detectChanges();

  }

  getSelectedService(event){
    this.selectedService = event;
    this._cd.detectChanges();
  }


}
