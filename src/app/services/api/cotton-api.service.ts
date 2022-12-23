import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CottonApiService {
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
    //   cotton seeds lots Api
    //   getAllCottonSeedsPurchaseList(paginationData,search: any = false){
    //     return this.httpClient.get(`${this.COTTON_API}/search/cottonseedslot/spec?page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=createdDate,desc`).toPromise()
    //   } 
    createSeedsPurchaseOrder(payload){
        return this.httpClient.post(`${this.COTTON_API}/cottonseedslot`,payload).toPromise()
    } 

    async getAllCottonSeedsPurchaseList(paginationData,search:any=false){
        !paginationData && (paginationData =this.defaultPagination);
        const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
        return this.httpClient.get(`${this.COTTON_API}/search/cottonseedslot/spec?${searchQuery}`).toPromise()
    }
    getCottonSeedsById(lotid){
        return this.httpClient.get(`${this.COTTON_API}/cottonseedslot/${lotid}`).toPromise()
    } 

    patchSeedsOrderById(id,payload,){
        return this.httpClient.patch(`${this.COTTON_API}/cottonseedslot/${id}`,payload).toPromise()
    }

    //get All cotton sales order
    allCottonSalesOrderList(paginationData,search:any=false){
        !paginationData && (paginationData =this.defaultPagination);
        const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
        return this.httpClient.get(`${this.COTTON_API}/search/cottonseedssalesorder/spec?${searchQuery}`).toPromise()
        // return this.httpClient.get(`${this.COTTON_API}/search/cottonseedssalesorder/spec?page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=createdDate,desc`).toPromise()
    }

    //Seeds-Sales-Order-Dtails-Api//
    async getSeedsSalesOderById(id) {
      return this.httpClient.get(`${this.COTTON_API}/cottonseedssalesorder/${id}`).toPromise();
    }
    //-------------------------------//

    //Seeds--Sales-order-payment-details--//
    async getSeedsSalesOderPaymentsById(id) {
      return this.httpClient.get(`${this.COTTON_API}/cottonseedssalesorder/${id}/oilmillpayment`).toPromise();
    }
    //-------------------------------------//

    createSeedsSalesOrderPayment(payload){
      return this.httpClient.post(`${this.COTTON_API}/oilmillpayment`, payload).toPromise();
     }
   
}
