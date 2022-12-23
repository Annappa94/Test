import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankServiceService {
  SOR_SERVICE = environment.API;
  DIGIO_SERVICE  = environment.API+'/digiobanksvc';
  LOAN_SERVICE  = environment.API+'/creditlinesvc';
  CUSTOMER_SERVICE  = environment.API+'/mudracustomersvc';
  COTTON_API  = environment.API+'/cottonsvc';


  private defaultPagination={
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  }

  constructor(private httpClient:HttpClient) { }

  getDetailsById(endpoint:string,id) {
    return this.httpClient.get(`${this.DIGIO_SERVICE}/${endpoint}/${id}`).toPromise();
  }
  
    createRecord(endpoint:string,payload:any) {
    return this.httpClient.post(`${this.DIGIO_SERVICE}/${endpoint}`,payload).toPromise();
  }

  getDIGIO_Records(endpoint:string){
    return this.httpClient.get(`${this.DIGIO_SERVICE}/${endpoint}`).toPromise();
  }

  updateRecordLoan(endpoint:string,payload:any) {
    return this.httpClient.put(`${this.LOAN_SERVICE}/${endpoint}`,payload).toPromise();
  }
  //Updated by Manjunath B
  updateLeadBank(endpoint:string,payload:any) {
    return this.httpClient.put(`${this.CUSTOMER_SERVICE}/${endpoint}`,payload).toPromise();
  }


  getRecordLoan(endpoint:string) {
    return this.httpClient.get(`${this.LOAN_SERVICE}/${endpoint}`).toPromise();
  }
  getRecordLoanForLead(endpoint:string) {
    return this.httpClient.get(`${this.CUSTOMER_SERVICE}/${endpoint}`).toPromise();
  }
  //Updated by Manjunath B
  getLeadRecordLoan(endpoint:string) {
    return this.httpClient.get(`${this.CUSTOMER_SERVICE}/${endpoint}`).toPromise();
  }

  createRecordLoan(endpoint:string,payload:any) {
    return this.httpClient.post(`${this.LOAN_SERVICE}/${endpoint}`,payload).toPromise();
  }

  createInitiatePayment(endpoint:string,payload:any) {
    return this.httpClient.post(`${environment.API}/${endpoint}`,payload).toPromise();
  }
  //Updated by Manjunath B
  createLeadBanks(endpoint:string,payload:any) {
    return this.httpClient.post(`${this.CUSTOMER_SERVICE}/${endpoint}`,payload).toPromise();
  }

  updateLeadBanks(endpoint:string,payload:any) {
    return this.httpClient.patch(`${this.CUSTOMER_SERVICE}/${endpoint}`,payload).toPromise();
  }

  updateRecord(id,endpoint:string,payload:any) {
    return this.httpClient.patch(`${this.DIGIO_SERVICE}/${endpoint}/${id}`,payload).toPromise();
  }

  deleteRecord(endpoint:string,id:number) {
    return this.httpClient.delete(`${this.DIGIO_SERVICE}/${endpoint}/${id}`).toPromise();
  }

  patchRecord(endpoint:string,id,payload) {
    return this.httpClient.patch(`${this.DIGIO_SERVICE}/${endpoint}/${id}`,payload).toPromise();
  }

  async getSpecAPI_DIGIO(paginationData,endpoint:string,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.DIGIO_SERVICE}/${endpoint}/search/spec?${searchQuery}`).toPromise();
  }


  async getSpecAPI_LOAN(paginationData,endpoint:string,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.LOAN_SERVICE}/${endpoint}/search/spec?${searchQuery}`).toPromise();
  }
  async getSpecAPI_LOAN1(paginationData,endpoint:string,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.CUSTOMER_SERVICE}/${endpoint}/search/spec?${searchQuery}`).toPromise();
  }

  verifyBankAccount(profileId:string,accountId:string, bankType){
    return this.httpClient.put(`${this.LOAN_SERVICE}/customerprofile/bank/verify/${profileId}/${accountId}?verify=true&verificationType=MANUAL&bankType=${bankType.toUpperCase()}`,{}).toPromise();
  }
  verifyLeadBankAccount(leadId:string,leadProfileId:string,leadProfileType:string,accountId:string, bankType){
    return this.httpClient.put(`${this.CUSTOMER_SERVICE}/lead/profile/bank/verify/${leadId}/${leadProfileId}/${leadProfileType}/${accountId}?verify=true&verificationType=MANUAL&bankType=${bankType.toUpperCase()}`,{}).toPromise();
  }

  //Updated by Manjunath B
  verifyPennyDrop(payload){
    return this.httpClient.post(`${this.DIGIO_SERVICE}/digio/penny/drop`,payload).toPromise();
  }
  verifyLeadPennyDrop(payload){
    return this.httpClient.post(`${this.DIGIO_SERVICE}/digio/penny/drop`,payload).toPromise();
  }

   //Updated by Manjunath B
   verifyPennyDropRes(profileId:string,accountId:string,verified:boolean, bankType) {
    return this.httpClient.put(`${this.LOAN_SERVICE}/customerprofile/bank/verify/${profileId}/${accountId}?verify=${verified}&verificationType=PENNY&bankType=${bankType.toUpperCase()}`,{}).toPromise();
  }
   verifyLeadPennyDropRes(leadId:string,leadProfileId:string,leadProfileType:string,accountId:string,verified:boolean, bankType) {
    return this.httpClient.put(`${this.CUSTOMER_SERVICE}/lead/profile/bank/verify/${leadId}/${leadProfileId}/${leadProfileType}/${accountId}?verify=${verified}&verificationType=PENNY&bankType=${bankType.toUpperCase()}`,{}).toPromise();
  }
    //Updated by Manjunath B
    getVerifyPennyDrop(customerId,beneficiaryAccountNumber){
      return this.httpClient.get(`${this.DIGIO_SERVICE}/digio/penny/drop/search/spec?search=(customerId==${customerId} and beneficiaryAccountNumber==${beneficiaryAccountNumber})&page=0&size=10&sort=createdDate,desc`).toPromise();
    }
    getLeadVerifyPennyDrop(leadId,beneficiaryAccountNumber){
      return this.httpClient.get(`${this.DIGIO_SERVICE}/digio/penny/drop/search/spec?search=(customerId==${leadId} and beneficiaryAccountNumber==${beneficiaryAccountNumber})&page=0&size=10&sort=createdDate,desc`).toPromise();
    }
     //Updated by Manjunath B
     getMandateInfo(id){
      return this.httpClient.get(`${this.DIGIO_SERVICE}/mandatestatus/${id}`).toPromise();
    }

    // get bank details by IFSC code
    getBankDetailsByIfscCode(ifscCode){
      return this.httpClient.get(`${this.SOR_SERVICE}/razorpay/ifsc/${ifscCode}`).toPromise();
    }

    //penny drop validation
    validateBankAccount(reqOBJ){
      if (reqOBJ?.productType == 'Cotton') {
        return this.httpClient.post(`${this.COTTON_API}/bankdetails/verify`,reqOBJ).toPromise();
      } else {
        return this.httpClient.post(`${this.SOR_SERVICE}/bankdetails/verify`,reqOBJ).toPromise();
      }
    }

}
