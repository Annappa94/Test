import { ChangeDetectorRef, Inject, LOCALE_ID, Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { ApiService } from 'src/app/services/api/api.service';
import { formatDate } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FollowUpComponent } from '../dialog-models/follow-up/follow-up.component';
import { CustomValidator } from '../custom-validator/custom.validator';

@Component({
  selector: 'app-followups-crud',
  templateUrl: './followups-crud.component.html',
  styleUrls: ['./followups-crud.component.scss']
})
export class FollowupsCrudComponent implements OnInit {
  @Input() id;
  @Output() cancel = new EventEmitter<string>();

  followUpCreateForm: UntypedFormGroup;
  delBank;
  modalRef;
  closeResult;
  deleteBankIndex;

  edit = false;
  hasCustomer = false;
  usersList: any = [];
  farmerList: any = [];
  reelerList: any = [];
  weaverList: any = [];
  notesList: any = [];
  roles = ['ADMINISTRATOR', 'COperationsAgent','COCOON_PROCUREMENT_EXEC','COCOON_SALES_EXEC', 'COperationsManager','COCOON_PROCUREMENT_MANAGER',  'COCOON_SALES_MANAGER', 'YOperationsAgent', 'YOperationsManager', 'FinanceManager', 'FinanceHead', 'CCenterAgent', 'CCenterManager','FarmInputAgent','FarmInputManager', 'RetailSalesAgent', 'RetailSalesManager', 'RetailSourcingAgent', 'RetailSourcingManager', 'LogisticsManager', 'MudraAgent', 'MudraManager', 'CottonAgent','CottonManager','PupaeAgent','PupaeManager'];
  selectedCustomerList: any = [];
  selectedAssignee;
  selectedCustomer;
  centerList: any = [];
  masterCenterList: any = [];
  warehouseList: any = [];
  user: any;
  latitude:any;
  longitude:any;
  filePreviewImage:any;
  imgFile:any;
  imgUploaded:boolean=false;
  expandImage=false;
  modelImage='';
  minDate:any;
  selectedType = '';
  constructor(
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,    
    private utils: UtilsService,
    private modalService: NgbModal,
    @Inject(LOCALE_ID) private locale: string,
    public dialogRef: MatDialogRef<FollowupsCrudComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private ngxLoader : NgxUiLoaderService,
  ) {
    this.getAllWarehouse();
    
    this.user = JSON.parse(localStorage.getItem('_ud'));
    //console.log(this.user);
    
    this.followUpCreateForm = this.form.group({
      customerType: new UntypedFormControl(''),
      type: new UntypedFormControl('PURCHASE_FROM_RM', [Validators.required]),
      note: new UntypedFormControl('', [Validators.required,Validators.maxLength(2000)]),
      followUpDate: new UntypedFormControl('', [Validators.required]),
      status: new UntypedFormControl('Active',  [Validators.required]),
      assignedToPhone: new UntypedFormControl(''),
      assignedToName: new UntypedFormControl(''),
      customerId: new UntypedFormControl(''),
      customerName: new UntypedFormControl(''),
      customerPhone: new UntypedFormControl(''),
      customerObj: new UntypedFormControl(),
      centerObj: new UntypedFormControl(''),
      newNote: new UntypedFormControl('',[Validators.maxLength(2000)]),
      centerId: new UntypedFormControl('', [Validators.required]),
      subType: new UntypedFormControl('')
    });

  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
        }
        this.watchPosition();
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  watchPosition(){
    let id = navigator.geolocation.watchPosition((position) =>{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          if(position.coords.latitude === this.latitude){
            navigator.geolocation.clearWatch(id);
          }
          console.log(this.latitude, this.longitude);
          
    }, (error) =>{console.log(error)},
    {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    )
  }
  openMap(lat, lng){
    window.open("http://maps.google.com/maps?q=loc:" + lat + "," + lng, '_blank')
  }
  ngOnInit(): void {
    // this.getCenters();
    // this.getAllUsers();
    this.minDate=new Date();
    this.getLocation();
    this._cd.detectChanges();
    if (this.data && this.data.item) {
      console.log(this.data.item);
      
      let obj = {
        name: this.data.item.customerName,
        phone: this.data.item.customerPhone,
        id: this.data.item.customerId,
        type: this.data.item.customerType
      }
      this.selectedType = this.data.item.customerType;
      this.hasCustomer = true;
      
      this.followUpCreateForm.patchValue(this.data.item);
        this.selectedCustomer = obj;

        this.followUpCreateForm.patchValue({
          customerObj: obj,
        });

        if(this.data.item.customerType != 'RETAILER') {
          this.getCenters();
        }
      
        // if(this.data.item.centerName != '-') {
          if(this.data.item.customerType == 'RETAILER') {
            this.api.getWarehouseList().then(res => {
              this.warehouseList = res['_embedded']['warehouse'];
              this.centerList = [];
                for(let i=0;i<this.warehouseList.length;i++) {
                  let obj = {
                    centerName: this.warehouseList[i].name,
                    id : this.warehouseList[i].id
                  }
                  this.centerList.push(obj);
                }
                let center = {
                  centerName:this.data.item.centerName,
                  id: this.data.item.centerId
                }
                this.followUpCreateForm.patchValue({
                  centerObj: center,
                });
            })
          } else {
            let center = {
              centerName:this.data.item.centerName,
              id: this.data.item.centerId
            }
            this.followUpCreateForm.patchValue({
              centerObj: center,
            });
          }
        // }  
      if (this.data.item.id) {
        this.edit = true;
        this.id = this.data.item.id;
        this.getFollowUpById(this.data.item.id);
        this.getAllUsers();
        //console.log(this.data.item);        
        this.getAllUsers();
      
      this._cd.detectChanges();
      } else {
        this.hasCustomer = true;
        this.edit = false;
        // this.getAllFarmers();
        // this.getAllReelers();
        this.getAllUsers();
        // this.getAllWeavers();
        this._cd.detectChanges()
      }

    } else {
      this.edit = false;
      this.hasCustomer = false;
      this._cd.detectChanges();
      this.getCenters();
      // this.getAllFarmers();
      // this.getAllReelers();
      this.getAllUsers();
      // this.getAllWeavers();
    }
  }
  goBack() {
    this.router.navigate(['/followup/all']);
  }

  async open() {
    this.modalRef = this.modalService.open(FollowUpComponent,{backdrop: 'static',size: 'md', keyboard: false, centered: true});
    this.modalRef.componentInstance.resoponeFromFollowUp.subscribe((res) => {
     let obj = {
        name: res.name,
        phone: res.phone,
        id: res.id,
        type: res.type,
        code: res.code
      };
      this.selectedCustomerList[0]=obj
      this.selectedType = obj.type.toUpperCase();
      this.followUpCreateForm.get("customerObj").patchValue(obj);
      this.selectedCustomer=Object.assign(obj);
      this.customerChanged(obj);
      this._cd.detectChanges();
      console.log(res,this.selectedCustomer)
    })
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  centerChanged(item) {
    console.log(item);
    for(let i=0; i<this.centerList.length;i++) {
      if(this.centerList[i].id == item.target.value) {
        let center = {
          centerName:this.centerList[i].centerName,
          id: this.centerList[i].id
        }
        this.followUpCreateForm.patchValue({
          centerObj: center,
        });
        break;
      }
    }
  }

  getData(event) {
    if(event.term.length % 2 == 0) {
      this.api.searchAll(event.term).then((res:any) => {
        this.selectedCustomerList = res.filter(data=>!(data?.phone.includes('__DELETED')) );;
        this._cd.detectChanges();
      })
    }
    if( !event.term || event.term.length == 0) {
      this.selectedCustomerList = [];
      this._cd.detectChanges();
    }
    
  }

  customerChanged(customer) {
    this.centerList = [];
    let wareHouse = [];
    this.updateName(customer)
    if(customer) {
      this.selectedType = customer.type.toUpperCase();
    }
    if(!customer || (customer && customer.type != 'Farmer') ) {
      this.followUpCreateForm.get("subType").patchValue('');
    }
    if(customer && customer.type == 'Retailer') {
      for(let i=0;i<this.warehouseList.length;i++) {
        let obj = {
          centerName: this.warehouseList[i].name,
          id : this.warehouseList[i].id
        }
        
        wareHouse.push(obj);
      }
      this.centerList = [...wareHouse];
      this.followUpCreateForm.get("centerId").patchValue(wareHouse[0]['id']);
      this.followUpCreateForm.get("centerObj").patchValue(wareHouse[0]);
      this._cd.detectChanges();
    } else {
        this.centerList = [...this.masterCenterList];
        this._cd.detectChanges();
    }
  }

description = true;
  getFollowUpById(id) {
    this.ngxLoader.stop();
    this.api.getFollowUpById(id).then(response => {
      if (response) {
        if(response['notesCount'] > 0){
          
          this.description = false;
          this.api.getFollowUpNotes(this.id).then(notesData => {
            //console.log(notesData);
            if (notesData) {
              notesData['_embedded']['followupnotes'].forEach(element => {
                this.notesList.push({
                  id: element.id,
                  latitude: element.latitude ? element.latitude : '',
                  longitude: element.longitude ? element.longitude : '',
                  createdDate: element.createdDate ? this.utils.getDisplayTime(element.createdDate) : '',
                  note: element.note ? element.note : '',
                  createdBy: element.createdBy ? element.createdBy : '',
                  imageUrl: element.imageUrl ? element.imageUrl:''
                })
              });
              // console.log(this.notesList,"this.notesList")
              // console.log(response,"response")
            }
          })
          //console.log(this.notesList);
          
      }
        // this.getAllFarmers();
        // this.getAllReelers();
        // this.getAllUsers();
        // this.getAllWeavers();
        this.followUpCreateForm.patchValue(response);
        if (response['followUpDate']) {
          let date;
          date = response['followUpDate'] ? formatDate(response['followUpDate'], 'MM-dd-yyyy', this.locale) : ''
          const moment = _moment;
          this.followUpCreateForm.patchValue({
            followUpDate: moment(date, "MM/DD/YYYY"),
          });
        }
        let obj = {
          name: this.data.item.customerName,
          phone: this.data.item.customerPhone,
          id: this.data.item.customerId
        }
          this.followUpCreateForm.patchValue({
            customerObj: obj,
          });

      }
      this._cd.detectChanges();
    })
  }

  typeChange(event) {
    if (event.value == 'FARMER') {
      this.selectedCustomerList = [...this.farmerList];
    } else if (event.value == 'REELER') {
      this.selectedCustomerList = [...this.reelerList];
    } else if (event.value == 'WEAVER') {
      this.selectedCustomerList = [...this.weaverList];
    }
    this._cd.detectChanges();
  }

  assignedToChanged(phone) {
    let assignee = this.getDetailsOfRole(phone, this.usersList)

    this.selectedAssignee = assignee ? assignee['__zone_symbol__value'] : {};
  }

  async getAllUsers() {
    this.usersList = [];
    this.ngxLoader.stop();
    this.api.getAllUsersList(this.roles).then(res => {
      if (res['_embedded']['user'] && res['_embedded']['user'].length) {
        this.usersList = [...res['_embedded']['user']];
        if (this.id) {
          let value = this.getDetailsOfRole(this.followUpCreateForm.value.customerPhone, this.usersList);
          this.selectedAssignee = value['__zone_symbol__value'] ? value['__zone_symbol__value'] : '';
          this._cd.detectChanges();

        }
      } else {
        this.usersList = [];
      }
      this._cd.detectChanges();
    });
  }

  async getAllFarmers() {
    this.ngxLoader.stop();
    this.api.getAllFarmersList().then(res => {
      if (res) {
        res['_embedded']['farmer'].forEach(element => {
          this.farmerList.push({
            id: element.farmer.id,
            name: element.farmer.name ? element.farmer.name : '-',
            phone: element.farmer.phone ? element.farmer.phone : '-',
          })
        });
        if (this.id && this.followUpCreateForm.value.customerType == 'FARMER') {
          let value = this.getDetailsOfRole(this.followUpCreateForm.value.customerPhone, this.farmerList);
          // this.selectedCustomer = value['__zone_symbol__value'] ? value['__zone_symbol__value'] : '';
          this._cd.detectChanges();
        }
      }
      this._cd.detectChanges();

    }, err => {
      console.log(err);
    });
  }

  async getAllReelers() {
    this.ngxLoader.stop();
    this.api.getAllReelers().then(res => {
      if (res['_embedded'] && res['_embedded']['reeler'] && res['_embedded']['reeler'].length) {
        res['_embedded']['reeler'].forEach(element => {
          this.reelerList.push({
            id: element.reeler.id,
            name: element.reeler.name ? element.reeler.name : '-',
            phone: element.reeler.phone ? element.reeler.phone : '-',
          })

        });
        if (this.id && this.followUpCreateForm.value.customerType == 'REELER') {
          let value = this.getDetailsOfRole(this.followUpCreateForm.value.customerPhone, this.reelerList);
          // this.selectedCustomer = value['__zone_symbol__value'] ? value['__zone_symbol__value'] : '';
          this._cd.detectChanges();

        }
      } else {
        this.reelerList = [];
      }
      this._cd.detectChanges();
    });
  }

  async getDetailsOfRole(phone, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].phone == phone) {
        const reqObj = {
          id: array[i].id,
          name: array[i].name,
          phone: array[i].phone
        }
        return reqObj;
      }
    }
  }

  async getAllWeavers() {
    this.ngxLoader.stop();
    this.api.getAllWeaversList().then(res => {
      if (res['_embedded'] && res['_embedded']['weaver'] && res['_embedded']['weaver'].length) {
        res['_embedded']['weaver'].forEach(element => {
          this.weaverList.push({
            id: element.weaver.id,
            name: element.weaver.name ? element.weaver.name : '-',
            phone: element.weaver.phone ? element.weaver.phone : '-',
          })
        });
        if (this.id && this.followUpCreateForm.value.customerType == 'WEAVER') {
          let value = this.getDetailsOfRole(this.followUpCreateForm.value.customerPhone, this.weaverList);
          // this.selectedCustomer = value['__zone_symbol__value'] ? value['__zone_symbol__value'] : '';

          this._cd.detectChanges();
        }
      }
      this._cd.detectChanges();
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  saveFollowUpDetails(form) {
    this._cd.detectChanges();
    this.getLocation();
    if (this.id) {
      const params = {
        type: form.type ? form.type : '',
        note: form.newNote !== '' ? form.newNote : form.note,
        followUpDate: form.followUpDate ? form.followUpDate : Date.parse(new Date().toString()),
        status: form.status ? form.status : 'Active',
        assignedToPhone: this.selectedAssignee.phone ? this.selectedAssignee.phone : form.assignedToPhone,
        assignedToName: this.selectedAssignee.name ? this.selectedAssignee.name : form.assignedToName,
        centerId: form.centerObj.id,
        centerName: form.centerObj.centerName,
        assignedBy: this.user['name'],
        subType: form.subType ? form.subType : null,
      };
      //if(this.followUpCreateForm.get('newNote').value !== ''){
        const notes = {
          latitude: this.latitude,
          longitude: this.longitude,
          followUp: '/followUp/'+this.id,
          note: form.newNote !== '' ? form.newNote : form.note,
          noteDate: Date.parse(new Date().toString())
        }
        this.ngxLoader.stop();
        this.api.createFollowUpNotes(notes).then((response:any) => {
          if(this.imgUploaded&&response.id){
           this.api.uploadFollowUpNotesImage(this.imgFile.target.files[0] , response.id).then(res=>{
            setTimeout(()=>this.getFollowUpById(this.id),5000);
            this.snackBar.open('Image Updated successfully', 'Ok', {
              duration: 3000
            });
           })
          }
        });
      //}
      
      
    this.ngxLoader.stop();
      this.api.updateFollowUp(params, this.id,).then(res => {
        if (res) {
          
          this.dialogRef.close('updated');
          this.snackBar.open('Updated Follow Up successfully', 'Ok', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to Update Followup', 'Ok', {
            duration: 3000
          });
        }
      });
    } else {
      const params = {
        customerType: form.customerObj ? form.customerObj.type.toUpperCase() : '',
        type: form.type ? form.type : '',
        note: form.note ? form.note : '',
        followUpDate: form.followUpDate ? Date.parse(form.followUpDate) : Date.parse(new Date().toString()),
        status: form.status ? form.status : 'Active',
        assignedToPhone: this.selectedAssignee.phone ? this.selectedAssignee.phone : form.assignedToPhone,
        assignedToName: this.selectedAssignee.name ? this.selectedAssignee.name : form.assignedToName,
        customerId: form.customerObj ? form.customerObj.id : '',
        customerName: form.customerObj ? form.customerObj.name : '',
        customerPhone: form.customerObj ? form.customerObj.phone : '',
        centerId: form.centerObj.id,
        centerName: form.centerObj.centerName,        
        assignedBy: this.user['name'],
        subType: form.subType ? form.subType : null
      };
      
    this.ngxLoader.stop();
      this.api.createFollowUp(params).then(res => {
        const id=res['id'];
        if (res) {
          const notes = {
            latitude: this.latitude,
            longitude: this.longitude,
            followUp: '/followUp/'+id,
            note: form.note,
            noteDate: Date.parse(new Date().toString())
          }
          // Success Message
          // this.router.navigate(['/all-followups']);
          this.ngxLoader.stop();
          this.api.createFollowUpNotes(notes).then((response:any) => {    
            if(response){
              this.dialogRef.close('created');
              this.snackBar.open('Follow Up Created successfully', 'Ok', {
                duration: 3000
              });
            }        
            if(this.imgUploaded&&response.id){
              this.api.uploadFollowUpNotesImage( this.imgFile.target.files[0] , response.id).then(res=>{
              //  setTimeout(()=>this.getFollowUpById(id),5000);
              //  this.snackBar.open('Image Updated successfully', 'Ok', {
              //    duration: 3000
              //  });
              })
            }
          })
          
        } else {
          this.snackBar.open('Failed to created Follow Up', 'Ok', {
            duration: 3000
          });
        }
      });
    }
  }

  async getCenters() {
    this.ngxLoader.stop();
    this.api.getCentersList().then(details => {
      if (details) {
        this.centerList = details['_embedded']['center'];
        this.masterCenterList = details['_embedded']['center'];
        if(this.edit && this.followUpCreateForm.get('type').value == 'RETAILER') {
          this.centerList = [];
        this.api.getWarehouseList().then(res => {
          this.warehouseList = res['_embedded']['warehouse'];
          for(let i=0;i<this.warehouseList.length;i++) {
            let obj = {
              centerName: this.warehouseList[i].name,
              id : this.warehouseList[i].id
            }
            this.centerList.push(obj);
          }
            let center = {
              centerName:this.data.item.centerName,
              id: this.data.item.centerId
            }
            this.followUpCreateForm.patchValue({
              centerObj: center,
            });
        })
        }
        this._cd.detectChanges();
      }

    }, err => {
      console.log(err);
    });
  }

  async getAllWarehouse() {
    this.api.getWarehouseList().then(res => {
      this.warehouseList = res['_embedded']['warehouse'];
      this._cd.detectChanges();
    })
  }

  deleteBankDetails() {
    this.modalRef.close();
    const control = <UntypedFormArray>this.followUpCreateForm.controls['bankDetails'];
    control.removeAt(this.deleteBankIndex);
  }

  // Reeler Validations
  isControlValidForReeler(controlName: string): boolean {
    const control = this.followUpCreateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.followUpCreateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.followUpCreateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForReeler(controlName): boolean {
    const control = this.followUpCreateForm.controls[controlName];
    return control.dirty || control.touched;
  }
  removeRegCetificate() {
    this.filePreviewImage = undefined;
    this.imgUploaded = false;
    this.imgFile = null;
  }

  onRegCertificateUpload(image) {
    this.imgFile = image;
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviewImage = reader.result as string;
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
      this.imgUploaded = true;
    }
  }

  showImage(item) {
    this.modelImage = item.imageUrl;
    this.expandImage = true;
  }


    CUSTOMER_ENDPOINT = {
      Farmer:'farmer',
      Reeler:'reeler',
      Weaver:'weaver',
      Chawki:'chawki',
      Retailer:'retailer'
    }
    /** Update Name */
    @ViewChild('updateNameHTML')
    updateNameHTML:ElementRef
    updateNameForm:UntypedFormControl = new UntypedFormControl('',[Validators.required,CustomValidator.cannotContainOnlySpace]);
    updateNameAPI(name){
      this.ngxLoader.stop();
      this.api.patchCustomer(this.followUpCreateForm.get('customerObj').value?.id,{name},this.CUSTOMER_ENDPOINT[this.followUpCreateForm.get('customerObj').value?.type]).then((res:any) =>{
        this.modalRef.close();
        if(res){
          this.selectedCustomerList = [];
          this.selectedCustomer = res['id'];
          this.selectedCustomerList.push(res);
          let tempRes = res;
          tempRes['type'] = this.followUpCreateForm.get('customerObj').value?.type;
          this.followUpCreateForm.get('customerObj').patchValue(tempRes);
          this.customerChanged(res)
          this.updateNameForm.reset();
          this.snackBar.open('Updated successfully', 'Ok', {
            duration: 3000
          });
        }
      })
    }
  
    updateName(response){
      if(response['name'] == ""){            
        this.modalRef = this.modalService.open(this.updateNameHTML)
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed`;
          });
      }
    }
  
    close(){
      this.followUpCreateForm.get('customerObj').patchValue(null);
      this.modalRef.close();
    }
}
