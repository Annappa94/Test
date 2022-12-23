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
  selector: 'app-mulberry-iot-crud',
  templateUrl: './mulberry-iot-crud.component.html',
  styleUrls: ['./mulberry-iot-crud.component.scss']
})
export class MulberryIotCrudComponent implements OnInit {
  id;
  updateMulberryForm: UntypedFormGroup;
  Plotcode:any;
  agronimistName: any;
  agronomistPhone: any;
  specificDeviceData: any;
  agronomistId: any;


  mulberryFormInit(){
    this.updateMulberryForm = this.form.group({
      // agronomist: new FormControl('', Validators.required),
      agroName:new UntypedFormControl('', Validators.required),
      agroPhone:new UntypedFormControl(''),
      deviceCode: new UntypedFormControl(''),
      farmerName: new UntypedFormControl(''),
      farmerPhone: new UntypedFormControl(''),
      lastModifiedBy: new UntypedFormControl(''),
      plotCode: new UntypedFormControl(''),
      plotName: new UntypedFormControl(''),
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
    this.Plotcode = this.activatedRouter.snapshot.paramMap.get('plotCode');

    this.id=this.activatedRouter.snapshot.paramMap.get('id');
    console.log(this.id);
    
  }

  ngOnInit(): void {
    this.mulberryFormInit();
    // this.getDataByPlotID();
    this.getAgronomistList();
    this.getDataByDeviceID();
    console.log(this.activatedRouter);
    
    // const { id } = this.activatedRouter.snapshot.paramMap.get('plotCode');
    // this.Plotcode = this.activatedRouter.snapshot.paramMap.get('plotCode');
    // console.log(this.Plotcode);
    
  }
  
  // getDataByPlotID(){
  //   this.api.getDeviceDataByPlotID(this.Plotcode).then(res=>{
  //     console.log(res);
  //   })
  // }
  getDataByDeviceID(){
    this.api.getDeviceDataByDeviceID(this.Plotcode).then(res=>{
      console.log(res);
      this.specificDeviceData = res;
      this.updateMulberryForm.get('agroName').patchValue(this.specificDeviceData?.agronomistName);
      this.updateMulberryForm.get('deviceCode').patchValue(this.specificDeviceData?.deviceCode);
      this.updateMulberryForm.get('plotCode').patchValue(this.specificDeviceData?.plotCode);
      this.updateMulberryForm.get('plotName').patchValue(this.specificDeviceData?.plotName);
      this.updateMulberryForm.get('farmerName').patchValue(this.specificDeviceData?.farmerName);
      this.updateMulberryForm.get('farmerPhone').patchValue(this.specificDeviceData?.farmerPhone);
    })
  }

  agronomistList = [];
  getAgronomistList(){
    this.api.getAllUsersList('Agronomist').then(res=>{
      this.agronomistList = res['_embedded']['user']
      console.log(' this.agronomistList', this.agronomistList);
      
      
    })
  }
  agronomistChange(){
    this.agronomistList.forEach(ele=>{
      if(this.updateMulberryForm.get('agroName').value==ele.name)
      this.updateMulberryForm.get('agroPhone').patchValue(ele.phone);
      this.agronomistId = ele.id;
    });

    // this.agronimistName = item.name;
    // this.agronomistPhone = item.phone;
    
  }

  updtaeAgronmist(){
    let reqObj ={
      "agronomistName": this.updateMulberryForm.get('agroName').value,
      "agronomistPhone": this.updateMulberryForm.get('agroPhone').value,
      "agronomistId":this.agronomistId
    }
    console.log(reqObj);
    
    this.api.patchAgronimistdata(this.id,reqObj).then(res=>{
     console.log(res);
     this.snackBar.open('Agronomist Updated successfully', 'Ok', {
      duration: 3000
    });
    this.router.navigate(['/mulberry-iot/devices']);
     
    })
  }
}
