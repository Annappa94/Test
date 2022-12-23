import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit{

  @Input()
  layouttype:String;

  statesArray:any = [];
  districtsArray:any = [];
  pinCodeArray:any=[];
  addressForm: UntypedFormGroup;
  pincodeDetailsList:any;

  @Input()
  title:string = "Address Details";

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
  }

  createAddressForm(){
    this.addressForm = this.form.group({
        address: new UntypedFormControl(null, [Validators.required]),
        village: new UntypedFormControl(null),
        district: new UntypedFormControl(null, [Validators.required]),
        city:new UntypedFormControl(null),
        pincode: new UntypedFormControl(null, [Validators.required]),
        taluk: new UntypedFormControl(null),
        state: new UntypedFormControl(null, [Validators.required]),
        region: new UntypedFormControl(null),
        latitude: new UntypedFormControl(null),
        longitude: new UntypedFormControl(null),
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
    if (this.addressForm.get('pincode').value) {
        this.ngxLoader.stop();
      this.api.getPincodeInfo(this.addressForm.get('pincode').value).then(pincodeInfo => {
        this.pincodeDetailsList = pincodeInfo['content'];

        this.addressForm.get('district').patchValue(this.pincodeDetailsList[0].district);
        this.addressForm.get('taluk').patchValue(this.pincodeDetailsList[0].taluk);
        this.addressForm.get('region').patchValue(this.pincodeDetailsList[0].region);
      })
    }
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