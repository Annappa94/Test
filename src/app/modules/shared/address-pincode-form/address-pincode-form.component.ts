import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { isForInStatement } from 'typescript';

@Component({
  selector: 'address-pincode-form',
  templateUrl: './address-pincode-form.component.html'
})
export class AddressPincodeFormComponent implements OnInit{

  @Input()
  layouttype:String;

  @Input()
  pincode:boolean;

  @Input()
  address:boolean;

  @Input()
  district:boolean;

  @Input()
  village:boolean;

  @Input()
  city:boolean;

  @Input()
  taluk:boolean;

  @Input()
  region:boolean;

  @Input()
  state:boolean;

  @Input()
  lat:boolean;

  @Input()
  long:boolean;
  isVerfied:boolean;
  statesArray:any = [];
  districtsArray:any = [];
  pinCodeArray:any=[];
  addressForm: UntypedFormGroup;
  pincodeDetailsList:any;


  constructor(
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private form: UntypedFormBuilder,
    private ngxLoader: NgxUiLoaderService,

  ) {
    this.getLocation();
    this.layouttype = 'popup';
   }

  ngOnInit(): void {
    this.getAllStates();
    this.createAddressForm();
    console.log(this.layouttype);
    this._cd.detectChanges();
    this.checkPincode()
    console.log(this.lat);
  }

  checkPincode(){
    this.addressForm.get('pincode').valueChanges.subscribe(response => {
        console.log(response);
        if(this.addressForm.get('pincode').value.length == '6'){
            this.getPincodeInfo();
        }
    })
  }

  createAddressForm(){
   // let validator = [Validators.required];
    this.addressForm = this.form.group({
        address: new UntypedFormControl('', this.address? [Validators.required]: []),
        village: new UntypedFormControl('',this.village? [Validators.required]: []),
        district: new UntypedFormControl('',this.district? [Validators.required]: []),
        city:new UntypedFormControl('', this.city? [Validators.required]: []),
        pincode: new UntypedFormControl('',this.pincode? [Validators.required]: []),
        taluk: new UntypedFormControl('',this.taluk? [Validators.required]: []),
        state: new UntypedFormControl('',this.state? [Validators.required]: []),
        region: new UntypedFormControl('', this.region? [Validators.required]: []),
        latitude: new UntypedFormControl('', this.lat? [Validators.required]: []),
        longitude: new UntypedFormControl('', this.long? [Validators.required]: []),
      })
  }

  getAllStates(){
    this.api.getAllStates().then(states=>{
      this.statesArray = states;
      this._cd.detectChanges();
    })
  }

  resetAddress(){
    this.addressForm.get('taluk').patchValue(null)
    this.addressForm.get('district').patchValue(null)
    this.addressForm.get('pincode').patchValue(null)
    this.addressForm.get('region').patchValue(null);
}

  onSateSelection(){
    if(this.addressForm.get('state').value){
      this.resetAddress();
      this.ngxLoader.stop();
      this.getPincodeForState(this.addressForm.get('state').value);
    } 
  }

  getPincodeForState(state) {
    this.ngxLoader.stop();
    this.api.getPincodeOfState(state).then(pincodeList=> {
      this.pinCodeArray = pincodeList;
      this._cd.detectChanges();
    })
  }

  getPincodeInfo() {
    if (this.addressForm.get('pincode').value && this.isNumeric(this.addressForm.get('pincode').value)) {
        this.ngxLoader.stop();
      this.api.getPincodeInfo(this.addressForm.get('pincode').value).then(pincodeInfo => {
        this.pincodeDetailsList = pincodeInfo['content'];
        if(this.pincodeDetailsList.length){
          this.addressForm.get('district').patchValue(this.pincodeDetailsList[0].district);
          this.addressForm.get('taluk').patchValue(this.pincodeDetailsList[0].taluk);
          this.addressForm.get('region').patchValue(this.pincodeDetailsList[0].region);
          this.addressForm.get('state').patchValue(this.pincodeDetailsList[0].state);
        }
      })
    }
  }

  isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return  !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
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

  latitude;
  longitude;
  watchPosition(){
    let id = navigator.geolocation.watchPosition((position) =>{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          if(position.coords.latitude === this.latitude){
            navigator.geolocation.clearWatch(id);
          }

          this.addressForm.get('latitude').patchValue(this.latitude)
          this.addressForm.get('longitude').patchValue(this.longitude)
          //console.log(this.latitude, this.longitude);

    }, (error) =>{console.log(error)},
    {
      enableHighAccuracy : true,
      timeout: 5000,
      maximumAge: 0
    }
    )
  }



}