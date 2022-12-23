import { ChangeDetectorRef, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit,OnChanges {
  addressForm:UntypedFormGroup;
  
  @Input()
  manditory:boolean = false;
  @Input()
  isLatAndLong:boolean =false;
  @Input()
  data:any=false;
  @Input()
  title:string = 'Address Details';

  constructor(private form:UntypedFormBuilder,private _cd:ChangeDetectorRef) { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.manditory ? this.initalizeWithMandAddressForm():this.initalizeWithoutMandAddressForm();
   this.data && this.address.emit({data:this.addressForm.value,invalid:this.addressForm.invalid});
  //  console.log('000000',this.data)
  //  this.data && this.addressForm.patchValue(this.data)
   this.addressForm?.valueChanges?.subscribe(value=>{
    this.address.emit({data:this.addressForm.value,invalid:this.addressForm.invalid});
   })
  }
  
  @Output()
  address:EventEmitter<EmitInfo> = new EventEmitter<EmitInfo>();

  ngOnInit(): void {
  //  this.initalizeAddressForm();
  this.address.emit({data:this.addressForm.value,invalid:this.addressForm.invalid})

  }

  initalizeWithoutMandAddressForm(){
    this.addressForm = this.form.group({
      address: [this.data?.address],
      village: [this.data?.village],
      city: [this.data?.city],
      district: [this.data?.district],
      taluk: [this.data?.taluk],
      region: [this.data?.region],
      state: [this.data?.state],
      pincode: [this.data?.pincode],
      latitude: [this.data?.latitude],
      longitude: [this.data?.longitude],
    });
  }
  initalizeWithMandAddressForm(){
    this.addressForm = this.form.group({
      address: [this.data?.address,Validators.required],
      village: [this.data?.village],
      city: [this.data?.city],
      district: [this.data?.district],
      taluk: [this.data?.taluk],
      region: [this.data?.region,Validators.required],
      state: [this.data?.state,Validators.required],
      pincode: [this.data?.pincode],
      latitude: [this.data?.latitude],
      longitude: [this.data?.longitude],
    });
  }
}
export interface address{
  address: String,
  village: String,
  city: String,
  district: String,
  taluk: String,
  region: String,
  state: String,
  pincode: number,
  latitude: number,
  longitude:number,
}

export interface EmitInfo{
  data: address,
  invalid: boolean
}
