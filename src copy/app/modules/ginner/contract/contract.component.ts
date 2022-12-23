import { ChangeDetectorRef, Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { items } from 'fusioncharts';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  
  @Input()
  ginnerId:number;
  @Input()
  addressPresent:boolean;

  contractlist:any[];

  modalRef;
  closeResult;
  createContractForm:UntypedFormGroup;
  params: number;
  minStartDate;
  minEndDate;
  ginnerDetails: any;
  paginationData = {
    currentPage: 0,
    pageSize: 10,
    total: 0,
    pages: [],
    currentColumn: 'createdDate',
    currentDirection: 'desc',
  };
  id: any;
  contractorid:any;
  value: any;
  activecontract: any;

  formErrors = {
    "Duration":'',
    "contractCharges":'',
    "termsAndcondi":'',
    "payTerms":'',
    "productionLineUsed":'',
    "contractStartDate": '',
    "contractEndDate": '',
    "depositeAmount":'',
    "maxProdCapacityPerHr":''
    
  };

  validationMessages = {
    "Duration": {
      'required':'Please Enter  Duration',
       'pattern':'Please enter only Numbers',
     },
     "contractCharges": {
      'required':'Please Enter Charges', 
      'pattern':'Please enter only Numbers and not to start with 0',
     },
     "termsAndcondi": {
      'required':'Please Enter Terms&Conditions', 
     },
     "payTerms": {
      'required':'Please Enter Payment Terms', 
     },
     "productionLineUsed": {
      'required':'Please Enter Number of Production Line used', 
      'pattern':'Please enter only Numbers',
     },
     "contractStartDate":{
      'required':'Please Select Start Date',
     },
     "contractEndDate":{
      'required':'Please Select End  Date',
     },
     "depositeAmount": {
      'required':'Please Enter Deposite Amount ', 
      'pattern':'Number should not start with 0',
     },
     "maxProdCapacityPerHr": {
      'required':'Please maxProdCapacityPerHr ', 
      'pattern':'Number should not start with 0',
     },
     
   };

   contractCreateForms() {
    // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.createContractForm = this.form.group({
      contractStartDate: new UntypedFormControl('',[Validators.required]),
      contractEndDate: new UntypedFormControl('',[Validators.required]),
      Duration: new UntypedFormControl('',[Validators.required ,Validators.pattern('[0-9]{0,1}[0-9]{1}')]), 
      contractCharges: new UntypedFormControl('',[Validators.required,Validators.pattern('[1-9]{1}[0-9]{0,10}')]),
      termsAndcondi: new UntypedFormControl('',[Validators.required]),
      payTerms: new UntypedFormControl('',[Validators.required]),
      contractDocument: new UntypedFormControl(''),
      productionLineUsed:new UntypedFormControl(1,[Validators.required,Validators.pattern('^[0-9]*$')]),
      contractCertificateUrl:new UntypedFormControl(''),
      depositeAmount:new UntypedFormControl('',[Validators.required,Validators.pattern('[1-9]{1}[0-9]{0,10}')]),
      maxProdCapacityPerHr: new UntypedFormControl('',[Validators.required,Validators.pattern('[1-9]{1}[0-9]{0,10}')])


    });
 
    this.createContractForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }
 
  // Reactive form Error Detection
  onValueChanged(data?: any) {
    if (!this.createContractForm) { return; }
    const form = this.createContractForm;
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
   if(!this.createContractForm.valid){
     console.log("Form Is not Valid-------->");
     console.log(this.formErrors);
     if (!this.createContractForm) { return; }
     const form = this. createContractForm;
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
    if(this.createContractForm.valid){
       console.log("i am here");
        console.log("Form Is Valid-------->");
        let reqOBJ = {  
          contractStartDate:Date.parse(this.createContractForm?.value.contractStartDate),
          contractEndDate:Date.parse(this.createContractForm?.value.contractEndDate),
          duration:this.createContractForm?.value.Duration,
          chargesPerBale:parseInt(this.createContractForm?.value.contractCharges),
          termsAndConditions:this.createContractForm?.value.termsAndcondi,
          paymentTerms:this.createContractForm?.value.payTerms,
          contractDocument:this.createContractForm?.value.contractDocument,
          productionLinesUsed:parseInt(this.createContractForm?.value.productionLineUsed),
          contractCertificateUrl:this.createContractForm?.value.contractCertificateUrl,
          "ginner":"/ginner/"+ this.ginnerId,
          contractDetailGinnerProductionLine: [
            {
              "ginnerId": this.ginnerId,
              "productionLineNo": parseInt(this.createContractForm?.value.productionLineUsed),
              "maxProdCapacityPerHr": this.createContractForm?.value.maxProdCapacityPerHr,
              "noOfMachines": 0
            },
          ]
        }
          console.log(reqOBJ);
          
          this.addingContract(reqOBJ);
    }
 
  }

  // async contractCreateForms() {
  //   this.createContractForm = this.form.group({
  //     contractStartDate: new UntypedFormControl('',[Validators.required]),
  //     contractEndDate: new UntypedFormControl('',[Validators.required]),
  //     Duration: new UntypedFormControl('',[Validators.required ,Validators.pattern('[1-9]{1}[0-9]{9}')]), 
  //     contractCharges: new UntypedFormControl('',[Validators.required]),
  //     termsAndcondi: new UntypedFormControl('',[Validators.required]),
  //     payTerms: new UntypedFormControl('',[Validators.required]),
  //     contractDocument: new UntypedFormControl(''),
  //     productionLineUsed:new UntypedFormControl('',[Validators.required]),
  //     contractCertificateUrl:new UntypedFormControl('')

  //   });
  // }

 
  constructor(
    private api: ApiService,
    private _cd:ChangeDetectorRef,
    private ngxLoader:NgxUiLoaderService,
    private router:Router,
    private modalService: NgbModal,
    private form: UntypedFormBuilder,
    private route:ActivatedRoute,
    private snackBar:MatSnackBar,
    private toaster:ToastrService,
  ) { 
    const currentDay = moment().date()
    const currentMonth = moment().month()
    const currentYear = moment().year()

    const today = new Date();
    this.minStartDate = moment([currentYear,currentMonth,currentDay]);

    // this.minEndDate =new Date(().getDate()+1);
    // createContractForm.get('contractStartDate').value
    console.log('contract page',this.addressPresent);    
  }




  ngOnInit(): void {
    this.contractCreateForms();
    this.getAllcontracts();
  }
  changestartDate(event){
    this.createContractForm.get('contractEndDate').patchValue('');
    const selectedDate = new Date(event.value);
    this.minEndDate =new Date((selectedDate).setDate(new Date(selectedDate).getDate() + 1));
  }

  OnchangeDuration(){
    this.createContractForm.get('contractEndDate').patchValue('');
    const EnteredDuration = (this.createContractForm.value.Duration)*30;
    const selectedDate = new Date(this.createContractForm.value.contractStartDate);
    this.minEndDate =new Date((selectedDate).setDate(new Date(selectedDate).getDate() + EnteredDuration));
    this.createContractForm.get('contractEndDate').patchValue(this.minEndDate);
  }
  // popup form
  AddContract(addContract){
    this.modalRef = this.modalService.open(addContract)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.contractCreateForms();

    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  
  
  changeStatus(status,item){  
    this.id = item.id;
    this.modalRef = this.modalService.open(status,item)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  changeInactiveStatus(changeInactivestatus,item){  
    this.id = item.id;
    // this.value=item.activeContract
    this.modalRef = this.modalService.open(changeInactivestatus,item)
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  getAllcontracts(){
    this.api.searchAllContract(this.ginnerId,this.paginationData).then((response:any)=>{;
      console.log('sdsd',response);
      this.contractlist=response['content']
      this._cd.detectChanges()

    })
  }
  async onPageChange(page) {  
    this.paginationData.currentPage = page;
    this.getAllcontracts();
  }
  async onPageSizeChange() {
    this.getAllcontracts()
  }
 
  addingContract(createContractForm) {
    // const params = {
    // contractStartDate:createContractForm?.contractStartDate,
    // contractEndDate:createContractForm?.contractEndDate,
    // Duration:createContractForm?.Duration,
    // contractCharges:createContractForm?.contractCharges,
    // termsAndcondi:createContractForm?.termsAndcondi,
    // payTerms:createContractForm?.payTerms,
    // contractDocument:createContractForm.contractDocument,
    // productionLineUsed:createContractForm.productionLineUsed,
    // contractCertificateUrl:createContractForm.contractCertificateUrl,
    // "ginner":"/ginner/"+ this.ginnerId
    // }
    this.api.createContractForm(createContractForm).then((response:any)=>{
      
      this.toaster.success('Contract created successfully', 'Ok', {
        timeOut: 3000,
        
      })
      this.getAllcontracts();
      this._cd.detectChanges()
    
      this.modalRef.close();
      

    })
    
}
editGinner(){
  this.router.navigate(['/resha-farms/ginners/crud',this.ginnerId]);
}

expandImage=false;
modelImageUrl=null;
showImage(imageUrl) {
  // window.open(this.createContractForm?.contractCertificate);
  window.open(this.modelImageUrl)
  if(imageUrl) {
    this.modelImageUrl=null;
    this.getprotectedUrl(imageUrl);
    this.expandImage = true;
  }
}
async getprotectedUrl(imgUrl){
  const { targetUrl } : any = await this.api.getPresignedUrlForViewImage(imgUrl);
  this.modelImageUrl = targetUrl;
  this._cd.detectChanges()
}

onImageUpload(image) {
  if (image) {
    const file = image.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let previewImage = reader.result as string;
      this.getS3CatUrl(file.type,file);
      this._cd.detectChanges();
    };
    reader.readAsDataURL(file);
  }
}
imageLoading:boolean = false;
async getS3CatUrl(fileType,file){
  try{
    this.imageLoading = true;
    this._cd.detectChanges()
    await this.api.getKYCPresignedUrl(`kyc_farmer`,fileType.split('/')[1],122,"kyc").then((res:any)=>{
      this.calluploadImageToS3APICate(res.targetUrl,file,res.fileName);
      this.imageLoading = false;
    })
  }catch(err){
    this.createContractForm.get('contractCertificateUrl').patchValue('')
    this.snackBar.open('Image upload Failed', 'Ok', {
      duration: 3000
    });
    this.imageLoading = false;
    this._cd.detectChanges()
  }
}
async calluploadImageToS3APICate(s3url:String,file,fileNameFromS3:String){
  try{
    this.imageLoading = true;
    this._cd.detectChanges()
    await this.api.updateImageToS3Directly(s3url,file).then((res:any)=>{
      this.createContractForm.get('contractCertificateUrl').patchValue(fileNameFromS3)
      this.imageLoading = false;
      this._cd.detectChanges();
      });
  }catch(err){
    this.imageLoading = false;
    this.createContractForm.get('contractCertificateUrl').patchValue('')
      this.snackBar.open('Image upload Failed', 'Ok', {
        duration: 3000
      });
      this._cd.detectChanges()
  }
}
updateStatus(value,id){
  const reqObj={
    activeContract:value
  }

  this.api.updateContract(id,reqObj).then(response=>{
    this.toaster.success('Updated Contractor Status successfully', 'Ok', {
      timeOut: 3000,
    }) 
    this.modalRef.close()
    this.getAllcontracts();
    this._cd.detectChanges()

  
  })
}
updateInactiveStatus(id){
  this.api.updateInaciveContract(id,this.ginnerId).then(response=>{
    this.toaster.success('Updated Contractor Status successfully', 'Ok', {
      timeOut: 3000,
    }) 
    this.modalRef.close();
    this.getAllcontracts();
    this._cd.detectChanges()
  })
}

}
