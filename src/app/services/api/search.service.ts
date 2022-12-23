import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private api: string = environment.API;
  private hsnApi: String = environment.API+'/hsnsvc';
  private PUPAE_API:string = environment.API+'/pupaesvc';
  private COTTON_API:string = environment.API+'/cottonsvc';
  private otpApi: string = environment.API+'/otpsvc';
  // private logistic_api = environment.logisticsAPI+ '/logisticssvc';
  private logistic_api = environment.API+ '/logisticssvc';
  private mudra_followup = environment.API+ '/mudrafollowupsvc';
  private deviceManagement_API: string = environment.API+ '/devicemgmtsvc';
  private mulberryIotService_API: string = environment.API+ '/mulberryiotsvc';
  private mulberryAdvisoryService_API: string = environment.API+ '/mulberryiotadvisorysvc';
  private approval_API: string = environment.API+ '/approvalsvc';
  private catalog_service = environment.API+ '/catalogsvc';
  private rearingIot_service = environment.API+ '/riotsvc';
  private PayoutTicket = environment.API+ '/payoutsvc';

  private chawki_api:string = environment.API+'/chawkisvc';

  private yarnLotAPI = environment.API + '/yarnprocsvc';

  private defaultPagination={
    currentPage : 0,
    pageSize    : 10,
    total       : 0,
    pages       : [],
    currentColumn : 'createdDate',
    currentDirection: 'desc',
  }

  constructor(private httpClient: HttpClient
        ) { }

    async getAllWeaverPurchaseOrder(search:any=false,column='createdDate',sortType='desc',page=0,size=10){
      const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
      return this.httpClient.get(`${this.api}/search/yarnpurchaseorder/spec?${searchQuery}`).toPromise();
    }
    async getRetailerAggregates(retailerId, customerType, orderPaymentStatus, orderType, aggregateField){
      if(customerType==='reeler'){
        const searchQuery=`search=(${orderPaymentStatus}=in=(Pending,PartiallyPaid) and ${customerType}.id==${retailerId})&aggregateField=${aggregateField}`
        return this.httpClient.get(`${this.api}/analytics/aggregate/${orderType}?${searchQuery}`).toPromise();

      } else {
        const searchQuery=`search=(${orderPaymentStatus}=in=(Pending,PartiallyPaid) and orderStatus=out=(New,Cancel) and ${customerType}.id==${retailerId})&aggregateField=${aggregateField}`
        return this.httpClient.get(`${this.api}/analytics/aggregate/${orderType}?${searchQuery}`).toPromise();
      }
    }
    async getCustomerDepositDetails(customerId){
      return this.httpClient.get(`${this.api}/stlmntsvc/deposit/${customerId}`).toPromise();
    }
    async getCustomerDeposits(paginationData,search:any=false){
      !paginationData && (paginationData =this.defaultPagination);
       const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
       return this.httpClient.get(`${this.api}/stlmntsvc/deposit/spec?${searchQuery}`).toPromise();
     }
    async getInstanceOfDeposit(paginationData,search:any=false, id, customerType){
      !paginationData && (paginationData =this.defaultPagination);
       const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`search=(depositId==${id})&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
       return this.httpClient.get(`${this.api}/stlmntsvc/deposit/spec/instance/${customerType}payment?${searchQuery}`).toPromise();
     }
    async getAllSkuPurchaseOrder(search=false,column='createdDate',sortType='desc',page=0,size=10){
      const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
      return this.httpClient.get(`${this.api}/search/weaverskupo/spec?${searchQuery}`).toPromise();
    }
    async getAllWeaverSaleseOrder(search=false,column='createdDate',sortType='desc',page=0,size=10){
      const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
      return this.httpClient.get(`${this.api}/search/yarnsaleseorder/spec?${searchQuery}`).toPromise();
    }

    async getYarnDraftSalesOrders(search:any=false,column='id',sortType='desc',page=0,size=10){
      const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
      return this.httpClient.get(`${this.api}/yarnorder/draft/search/spec?${searchQuery}`).toPromise();
    }

    async geytAllWeavedSkuBatch(search:any=false,column='createdDate',sortType='desc',page=0,size=10){
      const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
      return this.httpClient.get(`${this.api}/search/mobilesku/spec?${searchQuery}`).toPromise();
    }
    async geytAllWeavedSkuBatchs(search:any=false,column='createdDate',sortType='desc',page=0,size=10){
      const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
      return this.httpClient.get(`${this.api}/search/skubatch/spec?${searchQuery}`).toPromise();
    }
    async geytAllRetailerSalesOrder(search:any=false,column='createdDate',sortType='desc',page=0,size=10){
      const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
      return this.httpClient.get(`${this.api}/search/retailersalesorder/spec?${searchQuery}`).toPromise();
    }

    async getAllYarnPO(search:any=false,column='createdDate',sortType='desc',page=0,size=10){
      const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
      return this.httpClient.get(`${this.api}/search/yarnlisting/spec?${searchQuery}`).toPromise();
    }

    async getAllChawkiOrder(search:any=false,column='createdDate',sortType='desc',page=0,size=10){
      const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
      return this.httpClient.get(`${this.chawki_api}/chawki/order/spec?${searchQuery}`).toPromise();
    }

    // /search/sku/spec
   /** @ctaegory @Type @Tag spec API  */
   /**@Category */


   async getCategories(paginationData,search:any=false){
    const  defaultPagination= {
      currentPage : 0,
      pageSize    : 10,
      total       : 0,
      pages       : [],
      currentColumn : 'name',
      currentDirection: 'asc',
    }
    !paginationData && (paginationData = defaultPagination);
    // search:any=false,column='createdDate',sortType='desc',page=0,size=10
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/category/spec?${searchQuery}`).toPromise();
   }

   async getTags(paginationData:any=false,search:any=false){
    const  defaultPagination= {
      currentPage : 0,
      pageSize    : 10,
      total       : 0,
      pages       : [],
      currentColumn : 'name',
      currentDirection: 'asc',
    }
    !paginationData && (paginationData = defaultPagination);
    // search:any=false,column='createdDate',sortType='desc',page=0,size=10
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/tag/spec?${searchQuery}`).toPromise();
   }

   async getTypess(paginationData,search:any=false){
    const  defaultPagination= {
      currentPage : 0,
      pageSize    : 10,
      total       : 0,
      pages       : [],
      currentColumn : 'name',
      currentDirection: 'asc',
    }
    !paginationData && (paginationData =defaultPagination);
    // search:any=false,column='createdDate',sortType='desc',page=0,size=10
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/type/spec?${searchQuery}`).toPromise();
   }

   async getMyFollowup(paginationData,search:any=false){
   const  defaultPagination= {
      currentPage : 0,
      pageSize    : 10,
      total       : 0,
      pages       : [],
      currentColumn : 'lastModifiedDate',
      currentDirection: 'desc',
    }
    !paginationData && (paginationData = defaultPagination);
    // search:any=false,column='createdDate',sortType='desc',page=0,size=10
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/followup/spec?${searchQuery}`).toPromise();
   }
   async getMudraMyFollowup(paginationData,search:any=false){
   const  defaultPagination= {
      currentPage : 0,
      pageSize    : 10,
      total       : 0,
      pages       : [],
      currentColumn : 'lastModifiedDate',
      currentDirection: 'desc',
    }
    !paginationData && (paginationData = defaultPagination);
    // search:any=false,column='createdDate',sortType='desc',page=0,size=10
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.mudra_followup}/followup/spec?${searchQuery}`).toPromise();
   }

   async getRenditta(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    // search:any=false,column='createdDate',sortType='desc',page=0,size=10
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/renditta/spec?${searchQuery}`).toPromise();
   }

   async getAllTwistingUnits(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
//   const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/yarntwistingunit/spec?${searchQuery}`).toPromise();
   }
   async getAllPupaeSuppliers(paginationData:any=false,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.PUPAE_API}/pupae/supplier/spec?${searchQuery}`).toPromise();
   }
   async getMasterCP(paginationData:any=false,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/costpricedetail/spec?${searchQuery}`).toPromise();
   }
   async getBusinessTypes(paginationData:any=false,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/businesstype/spec?${searchQuery}`).toPromise();
   }
   async getBusinessUnitForCollections(){
     return this.httpClient.get(`${this.api}/collectionsvc/enums/businessunit`).toPromise();
   }
   async getAgentCollections(businessUnit, agentId, partyId){
     return this.httpClient.get(`${this.api}/collectionsvc/dailytarget/agent/carryforward/${businessUnit}/${partyId}/${agentId}`).toPromise();
   }
   async saveMonthlyTargets(data, id){
     if(id){
       return this.httpClient.put(`${this.api}/collectionsvc/monthlytarget/${id}`, data).toPromise();

     } else {
       return this.httpClient.post(`${this.api}/collectionsvc/monthlytarget`, data).toPromise();

     }
   }
   async saveMarginMetrix(params, id){
     if(id){
       return this.httpClient.put(`${this.api}/approvalmatrix/${id}`, params).toPromise();
     } else {
       return this.httpClient.post(`${this.api}/approvalmatrix`, params).toPromise();
     }
   }
   async getWeeks(time){
     return this.httpClient.get(`${this.api}/collectionsvc/monthlytarget/weeks/${time}`).toPromise();
   }
   async getMonthsDataById(id){
     return this.httpClient.get(`${this.api}/collectionsvc/monthlytarget/${id}`).toPromise();
   }
   async getApprovalMetrixDataById(id){
     return this.httpClient.get(`${this.api}/approvalmatrix/${id}`).toPromise();
   }

   async getAllPupaeListing(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.PUPAE_API}/pupae/listing/spec?${searchQuery}`).toPromise();
   }

   async getAllPupaeOrder(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.PUPAE_API}/pupae/orders/spec?${searchQuery}`).toPromise();
   }


   async updatePupaeStatus(id:number,payload){
    return this.httpClient.patch(`${this.PUPAE_API}/pupaelisting/${id}`,payload).toPromise();
  }
  async updatePupaeOrderStatus(id:number,payload){
    return this.httpClient.patch(`${this.PUPAE_API}/pupaesalesorder/${id}`,payload).toPromise();
  }
   async createPupaeLot(payload){
    return this.httpClient. post(`${this.PUPAE_API}/pupaelisting`,payload).toPromise();
  }

  async updatePupaeLot(id:number,payload){
    return this.httpClient.patch(`${this.PUPAE_API}/pupaelisting/${id}`,payload).toPromise();
  }

  async getPupaeDetailsById(id:number){
    return this.httpClient. get(`${this.PUPAE_API}/pupaelisting/${id}`).toPromise();
  }

   async getAllPupaeBuyers(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.PUPAE_API}/pupae/buyer/spec?${searchQuery}`).toPromise();
   }

   async getAllReturnSalesOrder(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/retailersalesreturn/spec?${searchQuery}`).toPromise();
   }
   async getAllPromotionalCoupons(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
//   const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/promotionalcoupon/spec?${searchQuery}`).toPromise();
   }

   async getAllAuditList(paginationData,search:any=false,endpoint){
    !paginationData && (paginationData =this.defaultPagination);
//   const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/${endpoint}/spec?${searchQuery}`).toPromise();
   }
   async getAllAudit(paginationData,search:any=false,endpoint){
    !paginationData && (paginationData =this.defaultPagination);
//   const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/${endpoint}/spec?${searchQuery}`).toPromise();
   }

   async getAllPromotionalUsage(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/promotionalcouponusage/spec?${searchQuery}`).toPromise();
   }
   async getAllCheckers(paginationData,search:any=false){
    const  defaultPagination= {
      currentPage : 0,
      pageSize    : 10,
      total       : 0,
      pages       : [],
      currentColumn : 'createdAt',
      currentDirection: 'desc',
    }

    !paginationData && (paginationData = defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/checkers/spec?${searchQuery}`).toPromise();
   }

  async downloadReport(search:any=false,endpoint:string='rendittagrading'){
     const paginationData = this.defaultPagination;
     let lastDate:any = new Date();
     lastDate.setMinutes(59)
     lastDate.setHours(23);
     lastDate.setSeconds(59)
     lastDate.setMilliseconds(0);
     const searchQuery=search?`search=${search}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`search=(createdDate>=0 and createdDate<=${Date.parse(lastDate.toGMTString())})&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/report/${endpoint}?${searchQuery}`, {responseType: 'arraybuffer'}).toPromise();
   }

   async getOrders(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/${typeOfOrder}/spec?${searchQuery}`).toPromise();
   }

   //  created for batch as we moved from SOR to Chawki service
   async getAllChwakiOrders(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.chawki_api}/chawki/batch/spec?${searchQuery}`).toPromise(); 
   }

   async getchawkiOrder(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.chawki_api}/chawki/order/spec?${searchQuery}`).toPromise(); 
   }
   async getByPersona(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    //  const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/rmuser/${typeOfOrder}/pattern?${search}`).toPromise();
   }
   async getAllBaners(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/catalogsvc/search/${typeOfOrder}/spec?${searchQuery}`).toPromise();
   }
   async getMonthlyTargets(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/collectionsvc/${typeOfOrder}/spec?${searchQuery}`).toPromise();
   }
   async getMarginMetrixData(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/${typeOfOrder}/spec?${searchQuery}`).toPromise();
   }
   async getFullCatalogList(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/catalogsvc/${typeOfOrder}/spec?${searchQuery}`).toPromise();
   }

   async getSourcingDetails(search:any=false){
    const paginationData =this.defaultPagination;
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/catalogsvc/sourcing/catalog/skus/spec?${searchQuery}`).toPromise();
   }

   async getDailyTargetStatuses(){
     return this.httpClient.get(`${this.api}/collectionsvc/enums/collectionstatus`).toPromise();
   }
   async getDailyCollectionsStatuses(){
     return this.httpClient.get(`${this.api}/collectionsvc/enums/dailycollection/status`).toPromise();
   }

   async getRetailColors(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.catalog_service}/search/colors/spec?${searchQuery}`).toPromise();
   }

   async getOrdersCotton(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.COTTON_API}/search/${typeOfOrder}/spec?${searchQuery}`).toPromise();
   }
   async getWeaverReturnOrders(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/${typeOfOrder}/spec?${searchQuery}`).toPromise();
   }

   async getReshaMudraSpec(paginationData,typeOfOrder,search:any=false){
    const  defaultPagination  ={
      currentPage : 0,
      pageSize    : 10,
      total       : 0,
      pages       : [],
      currentColumn : 'createdDate',
      currentDirection: 'desc',
    }

    !paginationData && (paginationData = defaultPagination )
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/${typeOfOrder}/spec?${searchQuery}`).toPromise();
   }
   async getMudraSuppliersSpec(paginationData,typeOfOrder,search:any=false){
    const  defaultPagination  ={
      currentPage : 0,
      pageSize    : 10,
      total       : 0,
      pages       : [],
      currentColumn : 'createdDate',
      currentDirection: 'desc',
    }

    !paginationData && (paginationData = defaultPagination )
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/mudracustomersvc/supplier/spec?${searchQuery}`).toPromise();
   }
   async getMudraLenderSpec(paginationData,typeOfOrder,search:any=false){
    const  defaultPagination  ={
      currentPage : 0,
      pageSize    : 10,
      total       : 0,
      pages       : [],
      currentColumn : 'createdDate',
      currentDirection: 'desc',
    }

    !paginationData && (paginationData = defaultPagination )
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/mudracustomersvc/lender/spec?${searchQuery}`).toPromise();
   }
   getCustomerName(id){
     return this.httpClient.get(`${this.api}/creditlinesvc/creditline/spec?search=(customer.id==${id})`).toPromise();
   }

   creditLoans(paginationData,endpoint,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.api}/${endpoint}?${searchQuery}`).toPromise();
   }
   allLoansLedger(accountId){
    return this.httpClient.get(`${this.api}/creditlinesvc/creditline/spec/ledger?page=0&size=50&sort=createdDate,desc&search=(accountId==${accountId} and transactionType=in=(fee_charged,gst,fee_paid,gst_paid))`).toPromise();
   }
    //CreditLineLoans api Updated by Manjunath B
    CreditLineLoans(param,queryParams=''){
      return this.httpClient.get(`${this.api}/creditlinesvc/creditline/mudra?${queryParams}` +param).toPromise();
     }
    creditLineLoans(productType,customerId){
      return this.httpClient.get(`${this.api}/creditlinesvc/creditline/mudra?productType=${productType}&&customerId=${customerId}`).toPromise();
     }
     
   async specAPIForBid(paginationData,typeOfOrder,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/cocoonbidsvc/search/${typeOfOrder}/spec?${searchQuery}`).toPromise();
   }
   async getGSTList(){
     return this.httpClient.get(`${this.api}/gstdetails`).toPromise();
   }

   deleteRecord(endpoint:String,id){
     return this.httpClient.delete(`${this.api}/cocoonbidsvc/${endpoint}/${id}`).toPromise();
   }

   deleteColorRecord(id){
    return this.httpClient.delete(`${this.catalog_service}/colorcatalog/${id}`).toPromise();
  }

   deleteHsnRecord(id){
    return this.httpClient.delete(`${this.hsnApi}/hsncode/${id}`).toPromise();
  }
       // getTrancheLeveDetails updated by Manjunath B
    getTrancheLeveDetails(creditLineId){
      return this.httpClient.get(`${this.api}/creditlinesvc/creditline/spec?search=(id==${creditLineId})&sort=createdDate,desc`).toPromise();
     }
       // getTrancheLeveCollectedInfo updated by Manjunath B
       getTrancheLeveCollectedInfo(creditLineId){
      return this.httpClient.get(`${this.api}/creditlinesvc/creditline/chargehealth?loanId=${creditLineId}`).toPromise();
     }
       // getProductType updated by Manjunath B
    getProductType(){
      return this.httpClient.get(`${this.api}/creditlinesvc/enums/loan/type?page=0&size=100&sort=name,asc`).toPromise();
     }
       // postProductType updated by Manjunath B
    postProductType(params){
      return this.httpClient.post(`${this.api}/creditlinesvc/creditlimit/assignproducttype`,params).toPromise();
     }
       // depositPreClose updated by Manjunath B
    depositPreClose(id,params){
      return this.httpClient.post(`${this.api}/creditlinesvc/deposit/preclosure?loanId=${id}`,params).toPromise();
     }
      // reversal updated by Manjunath B
    reversal(params){
      return this.httpClient.post(`${this.api}/creditlinesvc/deposit/reversal`,params).toPromise();
    }
      // getTransactionType updated by Manjunath B
      getTransactionType(){
      return this.httpClient.get(`${this.api}/creditlinesvc/enums/ledgertransaction/type`).toPromise();
     }

     // getProfiles updated by Manjunath B
     getProfiles(){
      return this.httpClient.get(`${this.api}/mudracustomersvc/enums/lead/profiles`).toPromise();
     }
     // getSupplierType updated by Manjunath B
     getSupplierType(){
      return this.httpClient.get(`${this.api}/mudracustomersvc/suppliertypes`).toPromise();
     }
      // getSource updated by Manjunath B
      getSource(){
      return this.httpClient.get(`${this.api}/mudracustomersvc/enums/lead/sources`).toPromise();
     }
      // getRegions updated by Manjunath B
      getRegions(){
      return this.httpClient.get(`${this.api}/mudracustomersvc/enums/lead/regions`).toPromise();
     }
      // getBusinessTypess updated by Manjunath B
      getBusinessTypess(){
      return this.httpClient.get(`${this.api}/mudracustomersvc/enums/business/types`).toPromise();
     }
      // getIfscCode updated by Manjunath B
      getIfscCode(ifsc){
        return this.httpClient.get(`https://ifsc.razorpay.com/${ifsc}`).toPromise();
       }
      // getStatus updated by Manjunath B
      getStatus(){
      return this.httpClient.get(`${this.api}/mudracustomersvc/enums/lead/statuses?page=0&size=20&sort=createdDate,desc`).toPromise();
     }
      // onBoardLead updated by Manjunath B
      onBoardLead(params){
      return this.httpClient.post(`${this.api}/mudracustomersvc/lead/add`,params).toPromise();
     }
      updateFinanceInput(params){
      return this.httpClient.post(`${this.api}/mudracustomersvc/cam/financial/input`,params).toPromise();
     }
      getPopulateFinancialInput(params){
      return this.httpClient.put(`${this.api}/mudracustomersvc/cam/populate/financial/input`,params).toPromise();
     }
     
      // getLeadSpecAPI updated by Manjunath B
    async getLeadSpecAPI(paginationData,search:any=false){
      !paginationData && (paginationData =this.defaultPagination);
       const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
       return this.httpClient.get(`${this.api}/mudracustomersvc/lead/spec?${searchQuery}`).toPromise();
     }
      onPatchLead(params){
      return this.httpClient.put(`${this.api}/mudracustomersvc/lead/update`,params).toPromise();
     }
      getLeadDetailsById(id){
      return this.httpClient.get(`${this.api}/mudracustomersvc/lead/spec?search=(id==${id})`).toPromise();
     }
     // DownloadBNPLAgreement updated by Manjunath B
      getBNPLReport(id){
      return this.httpClient.get(`${this.api}/mudracustomersvc/report/bnpl/${id}`, {responseType: 'arraybuffer'}).toPromise();
     }
     // DownloadInvoiceAgreement updated by Manjunath B
      getInvoiceReport(id){
      return this.httpClient.get(`${this.api}/mudracustomersvc/report/invoice/${id}`, {responseType: 'arraybuffer'}).toPromise();
     }
     getLoanProductType(productType){
      return this.httpClient.get(`${this.api}/creditlinesvc/enums/loan/type?page=0&size=100&sort=name,asc&search=(value==${productType})`,).toPromise();
     }
      // onBoardSupplier updated by Manjunath B
      onBoardSupplier(params){
        return this.httpClient.post(`${this.api}/mudracustomersvc/supplier/add`,params).toPromise();
       }
       // getSupplierDetailsById updated by Manjunath B
      getSupplierDetailsById(id){
      return this.httpClient.get(`${this.api}/mudracustomersvc/supplier/spec?search=(id==${id} )`).toPromise();
     }
     // getSupplierProfileById updated by Manjunath B
      getSupplierProfileById(id){
      return this.httpClient.get(`${this.api}/mudracustomersvc/supplier/search/profile/${id}`).toPromise();
     }
     // onPatchSupplier updated by Manjunath B
      onPatchSupplier(params){
      return this.httpClient.put(`${this.api}/mudracustomersvc/supplier/update`,params).toPromise();
     }
     getFuzzyScore(customerId,beneficiaryAccountNumber){
      return this.httpClient.get(`${this.api}/digiobanksvc/digio/penny/drop/search/spec?search=(customerId==${customerId} and beneficiaryAccountNumber==${beneficiaryAccountNumber} )&page=0&size=10&sort=createdDate,desc`).toPromise();
     }

   createRecord(endpoint:string,payload){
    return this.httpClient.post(`${this.api}/cocoonbidsvc/${endpoint}`,payload).toPromise();
   }

   getRecordById(endpoint:string,id:number){
    return this.httpClient.get(`${this.api}/cocoonbidsvc/${endpoint}/${id}`).toPromise();
   }

  updateRecord(endpoint:String,id:number,payload){
    return this.httpClient.patch(`${this.api}/cocoonbidsvc/${endpoint}/${id}`,payload).toPromise();
  }

  initializeBid(id:number){
    return this.httpClient.post(`${this.api}/cocoonbidsvc/rmbids/layout/${id}`,{}).toPromise();
  }

   async getAllCarts(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/cartsvc/cart/all?${searchQuery}`).toPromise();
   }

   getDepositsInfo(id){
    return this.httpClient.get(`${this.api}/creditlinesvc/creditlinedeposit/${id}`).toPromise();
   }

   getMudraTotalInfo(queryParams=''){
    return this.httpClient.get(`${this.api}/creditlinesvc/creditline/mudra${queryParams}`).toPromise();
   }

   createCottonSalesOrder(payload:any){
    return this.httpClient.post(`${this.COTTON_API}/cottonSalesOrder`,payload).toPromise();
   }

   updatePayment(payload:any,endpoint){
    return this.httpClient.post(`${this.api}/${endpoint}`,payload).toPromise();
   }

   createPupaeSalesOrder(payload:any){
    return this.httpClient.post(`${this.PUPAE_API}/pupaesalesorder`,payload).toPromise();
   }
   async getAllConfig(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.api}/search/configs/spec?${searchQuery}`).toPromise();
   }

   async getAllRmProducts(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.hsnApi}/products/spec?${searchQuery}`).toPromise();
   }

   // logistics API search
   async getLogisticsCompanyData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.logistic_api}/logistics/company/spec?${searchQuery}`).toPromise();
   }
   async getAllOtpRules(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.otpApi}/search/otprules/spec?${searchQuery}`).toPromise();
   }

  //  Driver Spec API
  async getAllDriversData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.logistic_api}/logistics/driver/spec?${searchQuery}`).toPromise();
   }
   //  Vehicle Spec API
  async getAllVehiclesData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
     const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
     return this.httpClient.get(`${this.logistic_api}/logistics/vehicle/spec?${searchQuery}`).toPromise();
   }

  //  devices spec API
  async getAllDevicesData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.deviceManagement_API}/device/search/spec?${searchQuery}`).toPromise();
  }
  async getAllDeviceTypeData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=id,${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=id,${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.deviceManagement_API}/devicetype/search/spec?${searchQuery}`).toPromise();
  }

  async getAllDeviceSalesOrdersData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.deviceManagement_API}/search/devicemanagementsalesorder/spec?${searchQuery}`).toPromise();
  }

  // mulberryIot Service
  async getMulberryIotdevicesData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.mulberryIotService_API}/deviceallocation/search/spec?${searchQuery}`).toPromise();
  }

  async getMulberryPlots(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.mulberryIotService_API}/plot/search/spec?${searchQuery}`).toPromise();
  }
  async getMulberryAdvisoryList(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.rearingIot_service}/search/ticket/spec?${searchQuery}`).toPromise();
  }

  
   async downLoadCostprice(){
    return this.httpClient.get(`${this.api}/report/costprice/transactional?sort=createdDate,desc`,{responseType: 'arraybuffer'}).toPromise();
  }

  getRecord(endpoint:string){
    return this.httpClient.get(`${this.api}/${endpoint}`).toPromise();
   }

   //Cotton Balles
   async getSpinningMills(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.COTTON_API}/search/spinningmill/spec?${searchQuery}`).toPromise();
  }
  async getCottonPerforma(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.COTTON_API}/search/balepurchaseproforma/spec?${searchQuery}`).toPromise();
  }

  async getCottonSalesOrders(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.COTTON_API}/search/cottonbalesalesorder/spec?${searchQuery}`).toPromise();
  }

  async getBalePurchases(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.COTTON_API}/search/cottonbalelisting/spec?${searchQuery}`).toPromise();
  }

  async getAllFarmersListData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.api}/search/farmer/spec?${searchQuery}`).toPromise();
  }

  async getAllCocoonFarmersListData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.api}/search/farmerkycverified/spec?${searchQuery}`).toPromise();
  }

  // async getAllTicketListData(paginationData,search:any=false){
  //   !paginationData && (paginationData =this.defaultPagination);
  //   const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
  //   return this.httpClient.get(`${this.approval_API}/cocoonapproval/spec?${searchQuery}`).toPromise();
  // }

  async getAllTicketListData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.approval_API}/cocoonapproval/spec?${searchQuery}`).toPromise();
  }


  async getAllDrafSalesOrder(search:any=false,column='id',sortType='desc',page=0,size=10){
    const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
    return this.httpClient.get(`${this.api}/salesorder/draft/search/spec?${searchQuery}`).toPromise();
  }

  async getAllCatalogoueSampleSkus(paginationData,search:any=false) {
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.api}/catalogskus/spec?${searchQuery}`).toPromise();
  }

  async getAllCatalogoueSampleYarn(paginationData,search:any=false) {
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.catalog_service}/search/yarns/spec?${searchQuery}`).toPromise();
  }

  async getAllRetailerPurchaseOrder(search:any=false,column='createdDate',sortType='desc',page=0,size=10){
    const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
    return this.httpClient.get(`${this.api}/search/retailerpo/spec?${searchQuery}`).toPromise();
  }
  // rearing Iot APi's
  async getRearingIotdevicesData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.rearingIot_service}/search/deviceallocation/spec?${searchQuery}`).toPromise();
  }


  //IOT subscription
  async getAllSubscriptionsData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.deviceManagement_API}/subscriptionplan/search/spec?${searchQuery}`).toPromise();
  }

  async getAllDeviceSubscriptionsData(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.deviceManagement_API}/devicesubscription/search/spec?${searchQuery}`).toPromise();
  }

  async getAllYarnForApproval(search:any=false,column='createdDate',sortType='desc',page=0,size=10){
    const searchQuery=search?`search=${search}&page=${page}&size=${size}&sort=${column},${sortType}`:`page=${page}&size=${size}&sort=${column},${sortType}`;
    return this.httpClient.get(`${this.yarnLotAPI}/yarn/procurement/yarnlot?${searchQuery}`).toPromise();
  }
  
  uploadOpsDocs(payload){
    return this.httpClient.post(`${this.api}/mudracustomersvc/lead/ops/doc/add`,payload).toPromise();
  }

  getAllOpsDocByLeadUUId(leadUuId){
    return this.httpClient.get(`${this.api}/mudracustomersvc/lead/ops/doc/${leadUuId}`).toPromise();
  }


  //get all my reports api spec
  async getAllMyReports(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.api}/reportdata/user/spec?${searchQuery}`).toPromise();
  }
  // async getAdvsoryList(paginationData,typeOfOrder,search:any=false){
  //   !paginationData && (paginationData =this.defaultPagination);
  //    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
  //    return this.httpClient.get(`${this.api}/search/${typeOfOrder}/spec?${searchQuery}`).toPromise();
  //    return this.httpClient.get(`${this.api}/riotsvc/search/ticket/spec?page=0&size=20&sort=farmerName,asc`).toPromise();
  //  }
   getAdvsoryList(id) {
    return this.httpClient.get(`${this.deviceManagement_API}/mobile/devicedetail/${id}?serviceType=REARING`).toPromise();
  }
  async getAllPayoytTickets(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&${search}&business=RESHAFARMS&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.PayoutTicket}/payoutapproval/spec?${searchQuery}`).toPromise();
  }

  async getAllSearchPayoytTickets(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`${search}&business=RESHAFARMS&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.PayoutTicket}/payoutapproval/searchbyitemId?${searchQuery}`).toPromise();
  }

  async getAllSearchPayoytStartedTickets(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.PayoutTicket}/payoutapproval/searchbyitemId?status=STARTED &${searchQuery}`).toPromise();
  }

  async getApprovedPayoytTickets(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.PayoutTicket}/payoutapproval/spec?status=STARTED &${searchQuery}`).toPromise();
  }

  // payouts API
  getListOfPayouts(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.PayoutTicket}/payout/list/spec?${searchQuery}`).toPromise();  
  }

  async getAllSupplierPo(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.api}/supplierpurchaseorder/spec?${searchQuery}`).toPromise();
  }

  async getOilSpinningMills(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`page=${paginationData.currentPage}&search=${search}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.COTTON_API}/search/oilmill/spec?${searchQuery}`).toPromise();
  }
  async getBaleProductionList(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.COTTON_API}/production/spec?status=STARTED &${searchQuery}`).toPromise();
  }
  async allCottonSalesOrderList(paginationData,search:any=false){
    !paginationData && (paginationData =this.defaultPagination);
    const searchQuery=search?`${search}&business=RESHAFARMS&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`:`page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.COTTON_API}/cottonseedssalesorder/searchbyId?${searchQuery}`).toPromise();
  }
}
