import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KycComponent implements OnInit {
  kycCustomerTypes:any = [];
  // selectedCustomerType = 1;
  selectedCustomerType;
  proofs :any={};
  farmarID;
  editData : any = {};
  currentCustomer;
  microServicesUrls = { pupaebuyer:'pupaesvc',pupaesupplier:'pupaesvc' }
  constructor(
    public globalService: GlobalService,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private ngxLoader : NgxUiLoaderService,
    private route: ActivatedRoute,) { 
      this.farmarID = this.collectIdFromURL();
      this.personaTypeFromURL();
      this.selectedCustomerType = this.route.snapshot.paramMap.get("customerType");
    }

  collectIdFromURL(){
   return this.route.snapshot.paramMap.get("id");
  }

  personaTypeFromURL(){
    this.currentCustomer = this.route.snapshot.paramMap.get("parsonaType");  
    return this.currentCustomer;
  }

  ngOnInit(): void {
    this.getAllCustomerTypes();
    this.getAllFarmerKycDocList(this.farmarID);
  }

  getAllCustomerTypes(){
    this.api.getAllCustomerTypes().then(res => {
      this.kycCustomerTypes = res['_embedded']['kyccustomer'];
      const kycCustomer = this.kycCustomerTypes.find(customer=>customer.name==this.selectedCustomerType)
      this.onSelectOfCustomerType(kycCustomer.id);
      this._cd.detectChanges();
    });
  }

  onSelectOfCustomerType(item) {
    this.api.getAllDocumentsListByCustomerTypes(item, this.currentCustomer.toUpperCase()).then(res => {
      this.ngxLoader.stop();
      this.getAllFarmerKycDocList(this.farmarID);
      this.proofs = { ...res };
      this._cd.detectChanges();
    })
  }

  saveInfo(data){
    const { id ,images, name,editId,doc,verificationType} = data.data;
    let tempImage=[];

    images.filter(ele=>{
      let obj = {};
      obj['url'] = ele.imageUrl
      obj['tag'] = ele.tag
      tempImage.push(obj)
    });
   let kycDocument ;
   if(editId)
    kycDocument = `/kycdocument/${doc.id}`;
   else
    kycDocument = `/kycdocument/${id}`;

 
    let payload = {
      "verified":data.data.verificationType!=='SYSTEM'?true:false,
      "kycDocument":kycDocument,
      "kycNumber":name,
      "items":tempImage,
      "verificationType":verificationType,
    }
    payload[this.currentCustomer]=`/${this.currentCustomer}/${this.farmarID}`;

   if(!editId) 
   this.createFarmerKYC(payload,id,data['key'],data['index']);
   else
   this.updateFarmerKYC(payload,editId)
  }
  patchingData;
  createFarmerKYC(payload,id,key,index){
    payload['pupaeSupplier'] = payload['pupaesupplier'];
    payload['pupaeBuyer'] = payload['pupaebuyer'];
    let endPoint = this.currentCustomer;
    this.microServicesUrls[this.currentCustomer] &&( endPoint= this.microServicesUrls[this.currentCustomer] + '/'+ this.currentCustomer);
    this.ngxLoader.stop()
    this.api.createFarmerKYC(payload, endPoint).then(data=>{
      this.patchingData = {}
      this.patchingData['id'] = data['id'];
      this.patchingData['doc'] = data['document'];
      this.patchingData['key'] = key;
      this.patchingData['index'] = index;

      this.verifyKYC(payload,this.farmarID);
      this.snackBar.open('KYC Details Uploaded Succesfully', 'Ok', {
        duration: 3000
      });
    }).catch(err=>{
      console.log(err.error);
    });
  }


  updateFarmerKYC(payload,id){
    this.ngxLoader.stop();
    let endPoint = this.currentCustomer;
    this.microServicesUrls[this.currentCustomer] &&( endPoint= this.microServicesUrls[this.currentCustomer] + '/'+ this.currentCustomer);
    this.api.updateFarmerKYC(payload,id, endPoint).then(data=>{
      this.verifyKYC(payload,this.farmarID);
      this.snackBar.open('KYC Details Updated Succesfully', 'Ok', {
        duration: 3000
      });
    }).catch(err=>{
    });
  }

  getAllFarmerKycDocList(farmarID){
    this.ngxLoader.stop();
    let endPoint = this.currentCustomer;
    this.microServicesUrls[this.currentCustomer] &&( endPoint= this.microServicesUrls[this.currentCustomer] + '/'+ this.currentCustomer);
    this.api.getAllFarmerKycDocList(farmarID, endPoint).then(data=>{
      let obj = {};
      data['_embedded'][`${this.currentCustomer}kyc`].filter(ele=>{
        if(obj[ele?.document?.type1]){
          obj[ele?.document?.type1].push({
            name:ele?.document?.name,
            description:ele?.document?.description,
            id:ele?.id,
            "kycNumber": ele?.kycNumber,
            items:ele.items,
            document:ele?.document,
            verificationType:ele?.verificationType,
          })
        }else{
          obj[ele?.document?.type1]=[{
            name:ele?.document?.name,
            description:ele?.document?.description,
            id:ele?.id,
            document:ele?.document,
            "kycNumber": ele?.kycNumber,
            items:ele.items,
            verificationType:ele.verificationType
          }]
        }

        if(ele?.document?.type2)
        if(obj[ele?.document?.type2]){
          obj[ele?.document?.type2].push({
            name:ele?.document?.name,
            description:ele?.document?.description,
            id:ele?.id,
            "kycNumber": ele?.kycNumber,
            items:ele.items,
            document:ele?.document,
            verificationType:ele?.verificationType,
          })
        }else{
          obj[ele?.document?.type2]=[{
            name:ele?.document?.name,
            description:ele?.document?.description,
            id:ele?.id,
            document:ele?.document,
            "kycNumber": ele?.kycNumber,
            items:ele.items,
            verificationType:ele.verificationType
          }]
        }

      });
      this.editData = obj;
      this._cd.detectChanges()

    }).catch(err=>{

    });
  }

  verifyKYC(payload,id){

    this.api.verifyKYC(payload,id, this.currentCustomer).then(re=>{
      if(re){
        let param = {
          kycVerified: re['data']
        }
        this.api.updateCustomers(param, id, this.currentCustomer).then(res=> {

        })
      }
    })
  }

}
