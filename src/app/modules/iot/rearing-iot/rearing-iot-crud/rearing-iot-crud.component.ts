import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  selector: 'app-rearing-iot-crud',
  templateUrl: './rearing-iot-crud.component.html',
  styleUrls: ['./rearing-iot-crud.component.scss']
})
export class RearingIotCrudComponent implements OnInit {
  id;
  updateRearingIotForm: UntypedFormGroup;
  Plotcode:any;
  agronimistName: any;
  agronomistPhone: any;
  specificDeviceData: any;
  agronomistId: any;


  rearingIotFormInit(){
    this.updateRearingIotForm = this.form.group({
      // agronomist: new FormControl('', Validators.required),
      agroName:new UntypedFormControl('', Validators.required),
      agroId: new UntypedFormControl(''),
      agroPhone:new UntypedFormControl(''),
      deviceCode: new UntypedFormControl(''),
      farmerName: new UntypedFormControl(''),
      farmerPhone: new UntypedFormControl(''),
      lastModifiedBy: new UntypedFormControl(''),
    })
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
    this.id=this.activatedRouter.snapshot.paramMap.get('id');    
  }

  ngOnInit(): void {
    this.rearingIotFormInit();
    // this.getDataByPlotID();
    this.getAgronomistList();
   // this.getDataByDeviceID();    
  }
  
  getDataByDeviceID(){
    this.api.getRearingDeviceDataByID(this.id).then(res=>{
      this.specificDeviceData = res;
      this.updateRearingIotForm.get('agroId').patchValue(this.specificDeviceData?.agronomistId);
      this.updateRearingIotForm.get('agroName').patchValue(this.specificDeviceData?.agronomistName);
      this.updateRearingIotForm.get('deviceCode').patchValue(this.specificDeviceData?.deviceCode);
      this.updateRearingIotForm.get('farmerName').patchValue(this.specificDeviceData?.farmerName);
      this.updateRearingIotForm.get('farmerPhone').patchValue(this.specificDeviceData?.farmerPhone);
      this._cd.detectChanges();      
    })
  }

  agronomistList = [];
  getAgronomistList(){
    this.api.getAllUsersList('Agronomist').then(res=>{
      this.agronomistList = res['_embedded']['user'];      
      this.getDataByDeviceID(); 
    })
  }
  agronomistChange(){
    this.agronomistList.forEach(ele=>{
      if(this.updateRearingIotForm.get('agroId').value==ele.id){
        this.updateRearingIotForm.get('agroPhone').patchValue(ele.phone);
      this.updateRearingIotForm.get('agroName').patchValue(ele.name);
      this.agronomistId = ele.id;
      }
      
    });

    // this.agronimistName = item.name;
    // this.agronomistPhone = item.phone;
    
  }

  updtaeAgronmist(){
    let reqObj ={
      "agronomistName": this.updateRearingIotForm.get('agroName').value,
      "agronomistPhone": this.updateRearingIotForm.get('agroPhone').value,
      "agronomistId":this.agronomistId
    }    
    this.api.patchRiotAgronimistdata(this.id,reqObj).then(res=>{
     this.snackBar.open('Agronomist Updated successfully', 'Ok', {
      duration: 3000
    });
    this.router.navigate(['/resha-farms/rearing-iot/devices']);
     
    })
  }

}
