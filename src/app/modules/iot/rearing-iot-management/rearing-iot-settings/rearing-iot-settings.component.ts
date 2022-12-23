import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/services/global/global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, FormControlName, UntypedFormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-rearing-iot-settings',
  templateUrl: './rearing-iot-settings.component.html',
  styleUrls: ['./rearing-iot-settings.component.scss']
})
export class RearingIotSettingsComponent implements OnInit {
  thresholds = [];
  closeResult: string;
  modalRef;
  user;
  settingsForm: UntypedFormGroup;
  perDaysettingsForm: UntypedFormGroup;
  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    public globalService: GlobalService,
    private ngxLoader : NgxUiLoaderService,
    private form: UntypedFormBuilder,
  ) { 
    this.user = JSON.parse(localStorage.getItem('_ud'))
    this.settingsForm = this.form.group({
      deviceId: [''],
      temp_min_threshold: ['', Validators.required],
      temp_max_threshold: ['', Validators.required],
      humidity_min_threshold: ['', Validators.required],
      humidity_max_threshold: ['', Validators.required],
      //aq_min_threshold: ['', Validators.required],
      aq_max_threshold: ['', Validators.required],
      light_min_threshold: ['', Validators.required],
      light_max_threshold: ['', Validators.required],
      dayOfChawki: ['', Validators.required],
      instarStage: [''],
    })
    this.perDaysettingsForm=this.form.group({
       setting:new UntypedFormArray([]),
    })
  }

  ngOnInit(): void {
    this.getThresholds();
  }
thresholdData = [];
  async getThresholds() {
    this.thresholdData = [];
    this.ngxLoader.stop();
    (this.perDaysettingsForm.controls['setting'] as UntypedFormArray).clear();
    this.api.getThresholds().then(res => {
      //console.log(res);
      if(res['_embedded']['thresholds'].length > 0){
        this.thresholdData=[];   
        res['_embedded']['thresholds'].forEach(element => {
          if(element['dayOfChawki'] === 0){
            this.thresholdData.push({
              deviceId: element['id'],
              temp_min_threshold: element['temperature']['min'],
              temp_max_threshold: element['temperature']['max'],
              humidity_min_threshold: element['humidity']['min'],
              humidity_max_threshold: element['humidity']['max'],
              hd_minBreachAdvisory: element['humidity']['minBreachAdvisory'],
              hd_maxBreachAdvisory: element['humidity']['maxBreachAdvisory'],
              temp_minBreachAdvisory: element['temperature']['minBreachAdvisory'],
              temp_maxBreachAdvisory: element['temperature']['maxBreachAdvisory'],
              aq_max_threshold: element['airQuality']['max'],
              light_min_threshold: element['light']['min'],
              light_max_threshold: element['light']['max'],
              dayOfChawki: element['dayOfChawki'],
              instarStage: element['instarStage'],
            });
          }else{
            
            (this.perDaysettingsForm.controls['setting'] as UntypedFormArray).push(new UntypedFormGroup({
                deviceId: new UntypedFormControl(element['id']),
                temp_min_threshold:new UntypedFormControl(element['temperature']['min'], Validators.required),
                temp_max_threshold:new UntypedFormControl(element['temperature']['max'], Validators.required),
                humidity_min_threshold: new UntypedFormControl(element['humidity']['min'], Validators.required),
                humidity_max_threshold: new UntypedFormControl(element['humidity']['max'], Validators.required),
                //aq_min_threshold: new FormControl(element['airQuality']['min'], Validators.required),
                aq_max_threshold: new UntypedFormControl(element['airQuality']['max'], Validators.required),
                light_min_threshold: new UntypedFormControl(element['light']['min'], Validators.required),
                light_max_threshold: new UntypedFormControl(element['light']['max'], Validators.required),
                dayOfChawki: new UntypedFormControl(element['dayOfChawki'],Validators.required),
                instarStage: new UntypedFormControl(element['instarStage'],Validators.required),
            }));
          }
          
        });    
        
        if((this.perDaysettingsForm.controls['setting'] as UntypedFormArray).length==0){
          (this.perDaysettingsForm.controls['setting'] as UntypedFormArray).push(new UntypedFormGroup({
            deviceId: new UntypedFormControl(null),
            temp_min_threshold:new UntypedFormControl('', Validators.required),
            temp_max_threshold:new UntypedFormControl('', Validators.required),
            humidity_min_threshold: new UntypedFormControl('', Validators.required),
            humidity_max_threshold: new UntypedFormControl('', Validators.required),
           // aq_min_threshold: new FormControl('', Validators.required),
            aq_max_threshold: new UntypedFormControl('', Validators.required),
            light_min_threshold: new UntypedFormControl('', Validators.required),
            light_max_threshold: new UntypedFormControl('', Validators.required),
            dayOfChawki: new UntypedFormControl('',Validators.required),
            instarStage: new UntypedFormControl('',Validators.required),
        }));
        } 
        if(this.thresholdData.length>0)
        this.settingsForm.patchValue(this.thresholdData[0])
      }else{
        (this.perDaysettingsForm.controls['setting'] as UntypedFormArray).push(new UntypedFormGroup({
          deviceId: new UntypedFormControl(null),
          temp_min_threshold:new UntypedFormControl('', Validators.required),
          temp_max_threshold:new UntypedFormControl('', Validators.required),
          humidity_min_threshold: new UntypedFormControl('', Validators.required),
          humidity_max_threshold: new UntypedFormControl('', Validators.required),
          //aq_min_threshold: new FormControl('', Validators.required),
          aq_max_threshold: new UntypedFormControl('', Validators.required),
          light_min_threshold: new UntypedFormControl('', Validators.required),
          light_max_threshold: new UntypedFormControl('', Validators.required),
          dayOfChawki: new UntypedFormControl('',Validators.required),
          instarStage: new UntypedFormControl('',Validators.required),
      }));
    }     
      
      this.cdr.detectChanges();
    });
  }

  deleteSingleSetting(index,item){
    (this.perDaysettingsForm.controls['setting'] as UntypedFormArray).removeAt(index);
    ((item.deviceId)&&(this.deleteRecord(item.deviceId)));
  }

  editValues(data){
  const playload={
    dayOfChawki: data.dayOfChawki,
    instarStage: data.instarStage,
    temperature: {
        min: data.temp_min_threshold,
        max: data.temp_max_threshold
    },
    humidity: {
        min: data.humidity_min_threshold,
        max: data.humidity_max_threshold
    },
    airQuality: {
        //min: data.aq_min_threshold,
        max: data.aq_max_threshold
    },
    light: {
        min: data.light_min_threshold,
        max: data.light_max_threshold
    }
   } 
  if(data.deviceId)  
  this.api.patchThresholds(playload,data.deviceId).then(res=>{
    this.snackBar.open('Updated successfully', 'Ok', {
      duration: 3000
   });
   this.getThresholds();
  });
  else
  this.submitThresholds(data);
  }   

  
  addSetting(index){
    (this.perDaysettingsForm.controls['setting'] as UntypedFormArray).insert(index+1,new UntypedFormGroup({
      temp_min_threshold:new UntypedFormControl('', Validators.required),
      temp_max_threshold:new UntypedFormControl('', Validators.required),
      humidity_min_threshold: new UntypedFormControl('', Validators.required),
      humidity_max_threshold: new UntypedFormControl('', Validators.required),
      //aq_min_threshold: new FormControl('', Validators.required),
      aq_max_threshold: new UntypedFormControl('', Validators.required),
      light_min_threshold: new UntypedFormControl('', Validators.required),
      light_max_threshold: new UntypedFormControl('', Validators.required),
      dayOfChawki: new UntypedFormControl('',Validators.required),
      instarStage: new UntypedFormControl('',Validators.required),
    }));
  }

  deleteRecord(deviceId){
    this.api.deleteDevice(deviceId).then(res=>{
      this.snackBar.open('Threshold settings Saved', 'Ok', {
        duration: 3000
      });
    })
  }
  submitThresholds(globalValue){
    let settings = {
      "dayOfChawki": globalValue.dayOfChawki,
      "instarStage": globalValue.instarStage,
        "temperature": {
          "min": globalValue.temp_min_threshold,
          "max": globalValue.temp_max_threshold
        },
        "humidity": {
          "min": globalValue.humidity_min_threshold,
          "max": globalValue.humidity_max_threshold
        },
        "airQuality": {
          //"min": globalValue.aq_min_threshold,
          "max": globalValue.aq_max_threshold
        },
        "light": {
          "min": globalValue.light_min_threshold,
          "max": globalValue.light_max_threshold
        }
    }
    this.ngxLoader.stop();
    this.api.thresholdSettings(settings).then(res => {
      if(res){
        this.getThresholds();
        this.snackBar.open('Threshold settings Saved', 'Ok', {
          duration: 3000
        })
      }
    }).catch(err => {
      console.error(err);
    });
    
  }
}
