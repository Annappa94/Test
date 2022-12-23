import { EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-kycdetails',
  templateUrl: './kycdetails.component.html',
  styleUrls: ['./kycdetails.component.scss']
})
export class KYCdetailsComponent implements OnInit,OnChanges {
  kycForm:UntypedFormGroup;
  constructor(private form:UntypedFormBuilder) { }
  
  @Output()
  kyc : EventEmitter<EmitInfo> = new EventEmitter<EmitInfo>() ;
  @Input()
  manditory:boolean = false;
  @Input()
  data:any=false;
  @Input()
  title:String = 'KYC Details';

  ngOnChanges(changes: SimpleChanges): void {
    this.manditory ? this.initializeKycFormMand() : this.initializeKycForm();
    this.data && this.kyc.emit({data:this.kycForm.value,invalid:this.kycForm.invalid});
    this.kycForm?.valueChanges?.subscribe(value=>{
      this.kyc.emit({data:this.kycForm.value,invalid:this.kycForm.invalid});
    })
  }


  ngOnInit(): void {
  }

  initializeKycForm(){
    this.kycForm = this.form.group({
      kycPANNumber: [this.data?.kycPANNumber,Validators.required],
      kycAdhaarNumber: [this.data?.kycAdhaarNumber],
      govRegistrationId: [this.data?.govRegistrationId],
    })
  }
  initializeKycFormMand(){
    this.kycForm = this.form.group({
      kycPANNumber: [this.data?.kycPANNumber,Validators.required],
      kycAdhaarNumber: [this.data?.kycAdhaarNumber],
      govRegistrationId: [this.data?.govRegistrationId],
    })
  }

}

export interface Kyc{
  kycPANNumber: String,
  kycAdhaarNumber: String,
  govRegistrationId:String,
}

export interface EmitInfo{
  data: Kyc,
  invalid: boolean
}
