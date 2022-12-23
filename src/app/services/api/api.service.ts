import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OnlineStore } from 'src/app/model/qbuster/onlinestore.model';
import { OnlineProduct } from 'src/app/model/qbuster/onlineproducts.model';
import { Invoice } from 'src/app/model/qbuster/Invoice.model';
import { AllDevices } from 'src/app/model/Iot/iotDevice.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getAllTussarss(page: any, size: any, column: any, direction: any, status: any) {
    throw new Error('Method not implemented.');
  }



  private api: string = environment.API;
  private qbApi: string = environment.API;
  private hsnApi: String = environment.API + '/hsnsvc'
  private PUPAE_API: string = environment.API + '/pupaesvc';
  private COTTON_API: string = environment.API + '/cottonsvc';
  private otpApi: string = environment.API + '/otpsvc';
  private logistic_api = environment.API + '/logisticssvc';
  private deviceManagement_API: string = environment.API + '/devicemgmtsvc';
  private mulberryIotService_API: string = environment.API + '/mulberryiotsvc';
  private mulberryIotBeaconService_API: string = environment.API + '/mulberryiotbeaconsvc';
  private yarnLotAPI = environment.API + '/yarnprocsvc';
  private approval_API: string = environment.API + '/approvalsvc';
  private tussar_API: string = environment.API + '/tussarsvc';
  private rearingIot_service = environment.API + '/riotsvc';
  private SILK_API: string = environment.API + '/silksvc';
  private catalog_service = environment.API + '/catalogsvc';
  private YARN_API: string = environment.API + '/yarnprocsvc';
  private PAYOUT: string = environment.API + '/payoutsvc';
  private PAYOUT_API: string = environment.API + '/payoutsvc';
  private chawki_api: string = environment.API + '/chawkisvc';
  private Payment_Cart_api: string = environment.API + '/mirachsvc';


  constructor(
    private httpClient: HttpClient
  ) { }

  async get(url: string): Promise<any> {
    return this.httpClient.get(this.api + url).toPromise();
  }
  async post(url: string, data: any): Promise<any> {
    return this.httpClient.post(this.api + url, data).toPromise();
  }

  async searchAll(params) {
    return this.httpClient.get(this.api + '/search/phone/' + params).toPromise();
  }
  async getAllStates() {
    return this.httpClient.get(`${this.api}/address/state`).toPromise();
  }
  async getDistricsOfState(state) {
    return this.httpClient.get(`${this.api}/address/state/district?name=${state}`).toPromise();
  }
  async getPinOfDistrict(district) {
    return this.httpClient.get(`${this.api}/address/district/pincode?name=${district}`).toPromise();
  }
  async getPincodeOfState(state) {
    return this.httpClient.get(`${this.api}/address/state/pincode?name=${state}`).toPromise();
  }

  async getPincodeInfo(pincode) {
    return this.httpClient.get(`${this.api}/search/pincodes/spec?search=(pincode==${pincode})&page=0&size=10&sort=officeName,desc`).toPromise();
  }

  async createGST(params) {
    return this.httpClient.post(`${this.api}/gstdetails`, params).toPromise();
  }
  async updateGST(id: number, params: Object) {
    return this.httpClient.patch(`${this.api}/gstdetails/${id}`, params).toPromise();
  }
  async markAsLiveCatalog(params, live) {
    return this.httpClient.patch(`${this.api}/catalogsvc/catalogskus/live/${live}`, params).toPromise();
  }
  async farmersOnboarding(params) {
    return this.httpClient.post(this.api + '/farmer/', params).toPromise();
  }
  async pupaeSupplierOnboarding(params) {
    return this.httpClient.post(this.PUPAE_API + '/pupaesupplier', params).toPromise();
  }
  async pupaeBuyerOnboarding(params) {
    return this.httpClient.post(this.PUPAE_API + '/pupaebuyer', params).toPromise();
  }
  async farmMktPlcOnboarding(params) {
    return this.httpClient.post(this.api + '/farmermarketplace', params).toPromise();
  }
  async farmAdvisoriesCreation(params) {
    return this.httpClient.post(this.api + '/cocoonlifecycle', params).toPromise();
  }
  async farmRmFeedCreation(params) {
    return this.httpClient.post(this.api + '/rmfeed', params).toPromise();
  }
  async rmBannerCreation(params, id?: number) {
    if (id) {
      return this.httpClient.patch(`${this.api}/catalogsvc/mobilebanner/${id}`, params).toPromise();
    } else {
      return this.httpClient.post(`${this.api}/catalogsvc/mobilebanner`, params).toPromise();
    }
  }
  async weaversOnboarding(params) {
    return this.httpClient.post(this.api + '/weaver', params).toPromise();
  }

  async createWeaverBusinessProfile(params) {
    return this.httpClient.post(this.api + '/weaverbusprofile', params).toPromise();
  }

  async getWeaverBusinessProfile(id) {
    return this.httpClient.get(this.api + '/weaverbusprofile/' + id).toPromise();
  }
  async getFinancialInputsData(id) {
    return this.httpClient.get(this.api + '/mudracustomersvc/cam/financial/input/lead/' + id).toPromise();
  }

  async getScore(leaduuId) {
    return this.httpClient.get(this.api + '/mudracustomersvc/cam/score/card/lead/' + leaduuId).toPromise();
  }
  async getFinancialRisk(leaduuId) {
    return this.httpClient.get(this.api + '/mudracustomersvc/cam/rating/financial/risk/lead/' + leaduuId).toPromise();
  }

  async getIndustryRisk(leaduuId) {
    return this.httpClient.get(this.api + '/mudracustomersvc/cam/rating/industry/risk/lead/' + leaduuId).toPromise();
  }

  async calculateIndustryRisk(payload) {
    return this.httpClient.put(this.api + '/mudracustomersvc/cam/calculate/industry/risk', payload).toPromise();
  }

  async createIndustryRisk(payload) {
    return this.httpClient.post(this.api + '/mudracustomersvc/cam/rating/industry/risk', payload).toPromise();
  }

  async postFinancialRisk(payload) {
    return this.httpClient.post(this.api + '/mudracustomersvc/cam/rating/financial/risk', payload).toPromise();
  }
  async getConductRisk(leaduuId) {
    return this.httpClient.get(this.api + '/mudracustomersvc/cam/rating/conduct/lead/' + leaduuId).toPromise();
  }
  async postConductRisk(payload) {
    return this.httpClient.post(this.api + '/mudracustomersvc/cam/rating/conduct', payload).toPromise();
  }
  async calculateConductRatings(payload) {
    return this.httpClient.put(this.api + '/mudracustomersvc/cam/calculate/rating/conduct', payload).toPromise();
  }

  async updateWeaverBusinessProfile(params, id) {
    return this.httpClient.patch(this.api + '/weaverbusprofile/' + id, params).toPromise();
  }

  async farmerPayout(params) {
    return this.httpClient.post(this.api + '/farmerpayout', params).toPromise();
  }
  async getAllFarmersListByPage(page, size, column, direction, productType) {
    page = page ? page : 0;
    size = size ? size : 10;
    return this.httpClient.get(this.api + `/search/farmer/spec?search=(productType=in=${productType})&page=` + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async getAllReelersListByPage(page, size, column, direction) {
    page = page ? page : 0;
    size = size ? size : 10;
    return this.httpClient.get(this.api + '/search/reeler/spec?search=(productType=in=(Silk))&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async getAllRetailersListByPage(page, size, column, direction) {
    page = page ? page : 0;
    size = size ? size : 10;
    return this.httpClient.get(this.api + '/search/retailer/spec?search=&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async getAllWeaversListByPage(page, size, column, direction) {
    page = page ? page : 0;
    size = size ? size : 10;
    return this.httpClient.get(this.api + '/search/weaver/spec?search=&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async getAllLogisticsListByPage(page, size, column, direction, status, dispatchedStatus) {
    page = page ? page : 0;
    size = size ? size : 10;
    if (status && dispatchedStatus) {
      return this.httpClient.get(this.logistic_api + '/logistics/cocoonlotlogistics/spec?search=paymentStatus=in=' + status + ' and status=in=' + dispatchedStatus + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

    } else {
      if (!status) {
        return this.httpClient.get(this.logistic_api + '/logistics/cocoonlotlogistics/spec?search=paymentStatus=in=(Paid,Pending)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

      } else {
        return this.httpClient.get(this.logistic_api + '/logistics/cocoonlotlogistics/spec?search=paymentStatus=in=' + status + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

      }
    }
  }
  async getAllLogisticsList(page, size, column, direction, status, dispatchedStatus) {
    if (status && dispatchedStatus) {
      return this.httpClient.get(this.logistic_api + '/logistics/dispatchorder/spec?search=payoutStatus=in=' + status + ' and status=in=' + dispatchedStatus + ' and dispatchOrderType==(COCOON_LOTS)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
    }
    else {
      if (!status) {
        return this.httpClient.get(this.logistic_api + '/logistics/dispatchorder/spec?search=payoutStatus=in=(Paid,Pending)' + ' and dispatchOrderType==(COCOON_LOTS)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
      }
      else {
        return this.httpClient.get(this.logistic_api + '/logistics/dispatchorder/spec?search=payoutStatus=in=' + status + ' and dispatchOrderType==(COCOON_LOTS)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
      }
    }
  }
  async getAllRetailerPOListByPage(page, size, column, direction, searchParam) {
    page = page ? page : 0;
    size = size ? size : 10;
    return this.httpClient.get(this.api + `/search/retailerpo/spec?search=${searchParam}&page=${page}&size${size}&sort=${column},${direction}`).toPromise();
  }



  getAllCocoonLotByPage(page, size, column, direction, status, cocoonType, paymentStatus, splitHoder: any = false) {
    page = page ? page : 0;
    size = size ? size : 10;
    if (!status) {
      if (splitHoder) {
        return this.httpClient.get(this.SILK_API + '/search/cocoonlot/spec?search=(status=in=(New,Sold) and ' + splitHoder + ')&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
      }
      return this.httpClient.get(this.SILK_API + '/search/cocoonlot/spec?search=status=in=(New,Sold)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

    } else {
      if (splitHoder) {
        return this.httpClient.get(this.SILK_API + '/search/cocoonlot/spec?search=(status=in=' + status + ' and type=in=' + cocoonType + ' and paymentStatus=in=' + paymentStatus + ' and ' + splitHoder + ')&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
      }
      return this.httpClient.get(this.SILK_API + '/search/cocoonlot/spec?search=status=in=' + status + ' and type=in=' + cocoonType + ' and paymentStatus=in=' + paymentStatus + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
    }


  }

  // getYarnListingByPage(page,size, column, direction, yarnStatus, paymentStatus, purchaseStatus, location, denier, cocoonType, yarnType) {
  //   return this.httpClient.get(this.api + '/search/yarnlisting/spec?search=status=in=' + yarnStatus + ' and denier=in='+ denier + ' and yarnCocoonType=in='+ cocoonType +
  //   ' and yarnPurchaseStatus=in='+ purchaseStatus + ' and yarnLocation=in='+ location + ' and paymentStatus=in='+ paymentStatus + ' and type=in=' + yarnType
  //   + '&page='+ page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  // }

  getYarnListingByPage(search: any = false, column = 'createdDate', sortType = 'desc', page = 0, size = 10) {
    const searchQuery = search ? `search=${search}&page=${page}&size=${size}&sort=${column},${sortType}` : `page=${page}&size=${size}&sort=${column},${sortType}`;
    return this.httpClient.get(`${this.api}/search/yarnlisting/spec?${searchQuery}`).toPromise();
  }

  getYarnTwistingItems(search: any = false, column = 'createdDate', sortType = 'desc', page = 0, size = 10) {
    const searchQuery = search ? `search=${search}&page=${page}&size=${size}&sort=${column},${sortType}` : `page=${page}&size=${size}&sort=${column},${sortType}`;
    return this.httpClient.get(`${this.yarnLotAPI}/yarntwisting/twistinglots?${searchQuery}`).toPromise();
  }

  updateYarnTwisting(twistingId, reqObj) {
    return this.httpClient.patch(this.yarnLotAPI + `/yarntwisting/${twistingId}`, reqObj).toPromise();
  }

  getYarnLotsByPage(page, size, column, direction, searchParam) {
    const searchQuery = searchParam ? `${searchParam}&page=${page}&size=${size}&sort=${column},${direction}` : `page=${page}&size=${size}&sort=${column},${direction}`;
    return this.httpClient.get(this.yarnLotAPI + `/yarn/procurement/yarnlot?${searchQuery}`).toPromise();
  }
  getC2YList(page, size, column, direction, searchParam) {
    const searchQuery = searchParam ? `${searchParam}&page=${page}&size=${size}&sort=${column},${direction}` : `page=${page}&size=${size}&sort=${column},${direction}`;
    return this.httpClient.get(this.yarnLotAPI + `/c2y/spec?${searchQuery}`).toPromise();
  }
  getC2YById(id) {
    return this.httpClient.get(this.yarnLotAPI + `/c2y/spec?search=(id==${id})`).toPromise();
  }
  getYarnBookingId(id) {
    return this.httpClient.get(this.yarnLotAPI + `/yarn/procurement/yarnlot?search=(bookingType=="C2Y" and c2yId==${id})`).toPromise();
  }

  getShipmentDetailsById(id) {
    return this.httpClient.get(this.api + `/logisticssvc/shipment/${id}`).toPromise();
  }
  getPaymentDetailsById(id) {
    return this.httpClient.get(this.api + `/yarnprocsvc/c2y/payment/spec?search=(c2y.id==${id})`).toPromise();
  }

  getSkuByProductLine(query) {
    return this.httpClient.get(this.catalog_service + `/productline/v1/spec?${query}`).toPromise();
  } 

  getFiltersList(query) {
    return this.httpClient.get(this.api + `/${query}`).toPromise();
  } 
  
  getYarnLotQCRecordsByPage(page, size, column, direction, searchParams) {
    const searchQuery = searchParams ? `${searchParams}&page=${page}&size=${size}&sort=${column},${direction}` : `page=${page}&size=${size}&sort=${column},${direction}`;
    return this.httpClient.get(this.yarnLotAPI + `/yarn/procurement/yarnlot?${searchQuery}`).toPromise();
  }

  getYarnLotPackagingRecordsByPage(page, size, column, direction, searchParams) {
    return this.httpClient.get(this.yarnLotAPI + "/yarn/procurement/bagsforpackage?search=status=in=(SENT_FOR_PACKAGING)&page=" + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  createYarnLotPackages(yarnLotId, params) {
    return this.httpClient.post(this.yarnLotAPI + "/yarn/procurement/packages/" + yarnLotId, params).toPromise();
  }

  createTwistedYarnPackages(yarnLotId, params) {
    return this.httpClient.post(this.yarnLotAPI + "/yarntwisting/packages/" + yarnLotId, params).toPromise();
  }

  getYarnApprovalList(page, size, column, direction, searchParams) {
    const searchQuery = searchParams ? `search=${searchParams}&page=${page}&size=${size}&sort=${column},${direction}` : `page=${page}&size=${size}&sort=${column},${direction}`;
    return this.httpClient.get(this.yarnLotAPI + "/yarn/procurement/yarnlot?" + searchQuery).toPromise();
  }


  async searchYarnListing(page, size, column, direction, params) {
    return this.httpClient.get(this.api + '/search/yarnlisting/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  async getBulkUploadedBatches(search: any = false, column = 'createdDate', sortType = 'desc', page = 0, size = 10) {
    const searchQuery = search ? `search=${search}&page=${page}&size=${size}&sort=${column},${sortType}` : `page=${page}&size=${size}&sort=${column},${sortType}`;
    return this.httpClient.get(`${this.api}/search/bulkupload/spec?${searchQuery}`).toPromise();
  }

  async getYarnAggregateWeight(params) {
    return this.httpClient.get(this.api + '/analytics/yarn/list?search=' + params + '&aggregateField=availableWeight').toPromise();
  }

  async getYarnPOAggregateWeight(params) {
    let aggregateField = 'totalAmount'
    return this.httpClient.get(this.api + '/analytics/weaverpo/list?search=' + params + '&aggregateField=' + aggregateField).toPromise();
  }

  async getYarnOrderAggregate(params) {
    let aggregateField = ['totalWeight', 'totalAmount', 'dueAmount']
    return this.httpClient.get(this.api + '/analytics/yarnsales/list?search=' + params + '&aggregateField=' + aggregateField).toPromise();
  }

  getFollowUpsListByPage(page, size, column, direction, status, type, customerType, date) {
    page = page ? page : 0;
    size = size ? size : 10;
    return this.httpClient.get(`${this.api}/search/followup/spec?search=status=in=${status} ${type?'and type=in='+`${type}`:''}`  + ' and customerType=in=' + customerType + ' and (followUpDate>=' + date['start'] + ' and followUpDate<=' + date['end'] + ') ' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  getMudraFollowUpsListByPage(page, size, column, direction, status, type, customerType, date) {
    page = page ? page : 0;
    size = size ? size : 10;
    return this.httpClient.get(this.api + '/mudrafollowupsvc/followup/spec?search=status=in=' + status + ' and type=in=' + type + ' and customerType=in=' + customerType + ' and (followUpDate>=' + date['start'] + ' and followUpDate<=' + date['end'] + ') ' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  getMudraFollowUpsListById(id) {
    return this.httpClient.get(this.api + '/mudrafollowupsvc/followup/' + id).toPromise();
  }

  async getAllCocoonSOListByPage(page, size, column, direction, status) {
    page = page ? page : 0;
    size = size ? size : 10;
    if (!status) {
      return this.httpClient.get(this.SILK_API + '/search/cocoonorder/spec?search=orderPaymentStatus=in=(Paid,Pending)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

    } else {
      return this.httpClient.get(this.SILK_API + '/search/cocoonorder/spec?search=orderPaymentStatus=in=' + status + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

    }
  }
  async searchAllByCustomer(page, size, column, direction, params, customerType) {
    return this.httpClient.get(`${this.api}/search/${customerType}/spec?search=${params}&page=${page}&size=${size}&sort=${column},${direction}`).toPromise();
  }
  async searchAllFarmers(page, size, column, direction, params) {
    return this.httpClient.get(this.api + '/search/farmer/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  async searchAllCustomer(endpoint, page, size, column, direction, params) {
    return this.httpClient.get(this.api + '/search/' + endpoint + '/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  async searchFarmersByPhone(productType, size, column, direction, params) {
    return this.httpClient.get(this.api + '/search/farmer/byphone?' + params + '&productType' + productType + '&limit=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  async searchAllReelers(page, size, column, direction, params) {
    return this.httpClient.get(this.api + '/search/reeler/spec?search=' + params + ' and productType=in=Silk&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  async searchAllTussarReelers(page, size, column, direction, params) {
    return this.httpClient.get(this.api + '/search/reeler/spec?search=' + params + ' &page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async searchAllWeavers(page, size, column, direction, params) {
    return this.httpClient.get(this.api + '/search/weaver/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async searchAllRetailers(page, size, column, direction, params) {
    return this.httpClient.get(this.api + '/search/retailer/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async searchSkusByBarcode(page, size, column, direction, params) {
    return this.httpClient.get(this.api + '/sku/search/code?productcode=' + params + '&projection=skuProjection').toPromise();
  }
  async searchAllLogistics(page, size, column, direction, params) {
    return this.httpClient.get(this.logistic_api + '/logistics/dispatchorder/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async searchRetailerPO(page, size, column, direction, params) {
    return this.httpClient.get(this.api + '/search/retailerpo/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async searchCocoonLot(page, size, column, direction, params) {
    return this.httpClient.get(this.SILK_API + '/search/cocoonlot/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  async searchFollowUpsList(page, size, column, direction, params, date) {
    return this.httpClient.get(this.api + '/search/followup/spec?search=' + params + ' and (followUpDate>=' + date['start'] + ' and followUpDate<=' + date['end'] + ')' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async searchMudraFollowUpsList(page, size, column, direction, params, date) {
    return this.httpClient.get(this.api + '/mudrafollowupsvc/followup/spec?search=' + params + ' and (followUpDate>=' + date['start'] + ' and followUpDate<=' + date['end'] + ')' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  async searchCocoonSO(page, size, column, direction, params) {
    return this.httpClient.get(this.SILK_API + '/search/cocoonorder/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  async getAllFarmersList() {
    return this.httpClient.get(this.api + '/farmer?sort=createdDate,desc').toPromise();
  }
  async getAllWeaversList() {
    return this.httpClient.get(this.api + '/weaver?sort=createdDate,desc').toPromise();
  }

  async getCentersList() {
    return this.httpClient.get(this.api + '/center?sort=createdDate,desc').toPromise();
  }
  getCrcProcCenters() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=CRC&centerType=PROCUREMENT&centerType=SALES&sort=createdDate,desc').toPromise();
  }
  async getWarehouseList() {
    return this.httpClient.get(this.api + '/warehouse?sort=createdDate,desc').toPromise();
  }
  async getAuditList() {
    return this.httpClient.get(this.api + '/audittrail?sort=createdDate,desc').toPromise();
  }

  async getAllAuditList(search: any = false, column = 'createdDate', sortType = 'desc', page = 0, size = 10) {
    const searchQuery = search ? `search=${search}&page=${page}&size=${size}&sort=${column},${sortType}` : `page=${page}&size=${size}&sort=${column},${sortType}`;
    return this.httpClient.get(`${this.api}/search/audittrail/spec?${searchQuery}`).toPromise();
  }
  async getAuditListFilter(params) {
    return this.httpClient.get(this.api + `/audittrail/search/statusin?operationname=${params.operationname ? params.operationname : ''}&modulename=${params.modulename ? params.modulename : ''}&fromDate=${params.fromDate}&toDate=${params.toDate}`).toPromise();
  }

  async getyarnratesAuditList() {
    return this.httpClient.get(this.api + "/yarnratesaudit?sort=createdDate,desc").toPromise();
  }

  async getCocoonratesAuditList() {
    return this.httpClient.get('https://api.reshamandi.com/api' + "/mandiaudit?sort=createdDate,desc").toPromise();
  }

  async getFarmMktPlaceList() {
    return this.httpClient.get(this.api + '/farmermarketplace?sort=createdDate,desc').toPromise();
  }
  async getFarmAdvisoriesData() {
    return this.httpClient.get(this.api + '/cocoonlifecycle?sort=lastModifiedDate,desc').toPromise();
  }
  async getrmFeedData() {
    return this.httpClient.get(this.api + '/rmfeed?sort=lastModifiedDate,desc').toPromise();
  }
  async getAllCocoonsList() {
    return this.httpClient.get(this.api + '/cocoonlot?sort=createdDate,desc').toPromise();
  }

  async getCocoonLotsList(status) {
    if (status) {
      return this.httpClient.get(this.api + '/cocoonlot/search/status?status=' + status + '&sort=createdDate,desc').toPromise();
    } else {
      return this.httpClient.get(this.api + '/cocoonlot?sort=createdDate,desc').toPromise();
    }
  }

  async updateFarmers(param,id) {
    return this.httpClient.patch(this.api + '/farmer/' + id, param).toPromise();
  }
  async updateChawkiDateForIotFarmer(id,param) {
    return this.httpClient.patch(this.api + '/farmer/' + id, param).toPromise();
  }
  async updatePupaeSuppliers(param, id) {
    return this.httpClient.patch(this.PUPAE_API + '/pupaesupplier/' + id, param).toPromise();
  }
  async updatePupaeBuyers(param, id) {
    return this.httpClient.patch(this.PUPAE_API + '/pupaebuyer/' + id, param).toPromise();
  }

  async updateCustomers(param, id, customer) {
    return this.httpClient.patch(this.api + `/${customer}/` + id, param).toPromise();
  }

  async updateFarmMktPlc(param, id) {
    return this.httpClient.patch(this.api + '/farmermarketplace/' + id, param).toPromise();
  }
  async updateAdvisoriesList(param, id) {
    return this.httpClient.patch(this.api + '/cocoonlifecycle/' + id, param).toPromise();
  }
  async updateRmFeedList(param, id) {
    return this.httpClient.patch(this.api + '/rmfeed/' + id, param).toPromise();
  }
  async updateWeavers(param, id) {
    return this.httpClient.patch(this.api + '/weaver/' + id, param).toPromise();
  }
  async getKhathaListofFarmer(id) {
    return this.httpClient.get(this.api + '/farmer/' + id + '/cocoonlots?sort=createdDate,desc').toPromise();
  }
  async patchBankDetailsForFarmer(param, id) {
    return this.httpClient.patch(this.api + '/farmer/' + id, param).toPromise();
  }

  async getMandiPrices() {
    return this.httpClient.get(this.api + '/mandi?sort=lastModifiedDate,desc').toPromise();
  }
  async getWHLayoutInstance() {
    return this.httpClient.get(this.api + '/cocoonbidsvc/rmbids/layout/instance').toPromise();
  }
  async getPartitiontInstanceById(id) {
    return this.httpClient.get(this.api + '/cocoonbidsvc/warehouseinstance/' + id).toPromise();
  }
  async createWHLayout(params) {
    return this.httpClient.post(this.api + '/cocoonbidsvc/warehouselayout', params).toPromise();
  }
  async patchWHLayout(params, id) {
    return this.httpClient.patch(`${this.api}/cocoonbidsvc/warehouselayout/${id}`, params).toPromise();
  }

  async getYarnMandiPrices() {
    return this.httpClient.get(this.api + '/yarnrates?sort=lastModifiedDate,desc').toPromise();
  }
  async getGradeLot(params) {
    return this.httpClient.post(this.api + '/grade/renditta', params).toPromise();
  }

  async postCocoonLot(params) {
    return this.httpClient.post(this.SILK_API + '/cocoonlot', params).toPromise();
  }
  async postTussarlot(params) {
    return this.httpClient.post(this.tussar_API + '/tussarlot', params).toPromise();
  }
  async patchTussarlot(params) {
    return this.httpClient.post(this.tussar_API + '/tussarlot', params).toPromise();
  }

  async putCocoonLot(id, params) {
    return this.httpClient.patch(this.SILK_API + '/cocoonlot/' + id, params).toPromise();
  }
  async putSkuCatalog(id, params){
    return this.httpClient.patch(this.api + '/catalogsvc/catalogsku/' + id,params).toPromise();
  }

  async deleteCocoonLot(id) {
    return this.httpClient.delete(this.SILK_API + '/cocoonlot/' + id).toPromise();
  }
  async deleteKYCByPerforma(performa, id, kyc = '/kyc') {
    return this.httpClient.delete(this.api + `${kyc}/` + performa + '/' + id).toPromise();
  }

  async getCocoonLotById(id) {
    return this.httpClient.get(this.SILK_API + '/cocoonlot/' + id).toPromise();

  }
  async getCocoonLotByIdProjection(id) {
    return this.httpClient.get(this.SILK_API + '/cocoonlot/' + id + '?projection=cocoonlotProjection').toPromise();
  }
  async patchCocoonLot(id, params) {
    return this.httpClient.patch(this.SILK_API + '/cocoonlot/' + id, params).toPromise();
  }

  async userOnBoarding(params) {
    return this.httpClient.post(this.api + '/user', params).toPromise();
  }
  async getAllUsersList(param) {
    return this.httpClient.get(this.api + '/user/search/role?role=' + param + '&sort=createdDate,desc').toPromise();
  }
  async getCheckers() {
    return this.httpClient.get('http://192.168.1.14:8080/api/checkers').toPromise();
  }

  async updateMandiPrice(param, id) {
    return this.httpClient.put(this.api + '/mandi/' + id, param).toPromise();
  }
  async updateYarnMandiPrice(param, id) {
    return this.httpClient.put(this.api + '/yarnrates/' + id, param).toPromise();
  }

  async createMandi(param) {
    return this.httpClient.post(this.api + '/mandi', param).toPromise();
  }
  async createDailyTarget(param) {
    return this.httpClient.post(this.api + '/collectionsvc/dailytarget', param).toPromise();
  }
  async patchDailyTarget(param, id) {

    return this.httpClient.patch(this.api + '/collectionsvc/dailytarget/' + id, param).toPromise();

  }
  async patchDailyCollection(id, type, param) {
    return this.httpClient.put(this.api + `/collectionsvc/dailycollection/status/${id}/${type.toUpperCase()}`, param).toPromise();
  }
  async createYarnMandi(param) {
    return this.httpClient.post(this.api + '/yarnrates', param).toPromise();
  }

  async createCenter(param) {
    return this.httpClient.post(this.api + '/center', param).toPromise();
  }

  async getAllCenterSpec() {
    return this.httpClient.get(this.api + '/center?sort=centerName,asc').toPromise();
  }

  async createWarehouse(param) {
    return this.httpClient.post(this.api + '/warehouse', param).toPromise();
  }

  async getAllCenter() {
    return this.httpClient.get(this.api + '/center?sort=createdDate,desc').toPromise();
  }

  async getAllReelers() {
    return this.httpClient.get(this.api + '/reeler?sort=createdDate,desc').toPromise();
  }
  async getAllRetailerPOs(status) {
    return this.httpClient.get(this.api + '/retailerpurchaseorder/search/status?poStatus=' + status + '&sort=createdDate,desc').toPromise();
  }
  async getAllRetailers() {
    return this.httpClient.get(this.api + '/retailer?sort=createdDate,desc').toPromise();
  }

  async getPOForRetailer(retailerId) {
    return this.httpClient.get(this.api + '/retailer/' + retailerId + '/retailerpurchaseorders?sort=createdDate,desc').toPromise();
  }

  async postReeler(reqObj) {
    return this.httpClient.post(this.api + '/reeler', reqObj).toPromise();
  }
  async postCocoonPricePrediction(reqObj) {
    return this.httpClient.post(this.api + '/aiml/cocoon_price_forecasting', reqObj).toPromise();
  }
  async postRetailer(reqObj) {
    return this.httpClient.post(this.api + '/retailer', reqObj).toPromise();
  }

  async postRetailerColor(reqObj) {
    return this.httpClient.post(this.catalog_service + '/colorcatalog', reqObj).toPromise();
  }

  async putReeler(id, reqObj) {
    return this.httpClient.patch(this.api + '/reeler/' + id, reqObj).toPromise();
  }
  //patch persona details updated by Manjunath B
  async updatePersona(id, reqObj, endpoint) {
    return this.httpClient.patch(this.api + '/' + endpoint + '/' + id, reqObj).toPromise();
  }
  //isReportAvailable Api updated by Manjunath B
  async isReportAvailable(phone) {
    return this.httpClient.get(this.api + '/creditscoresvc/report/available?phoneNo=' + phone).toPromise();
  }
  // otpRegistration Api updated by Manjunath B
  async otpRegistration(payload) {
    return this.httpClient.post(this.api + '/creditscoresvc/otp/registration', payload).toPromise();
  }
  // otpGeneration Api updated by Manjunath B
  async otpGeneration(payload) {
    return this.httpClient.post(this.api + '/creditscoresvc/otp/generation', payload).toPromise();
  }
  // otpValidation Api updated by Manjunath B
  async otpValidation(payload) {
    return this.httpClient.post(this.api + '/creditscoresvc/otp/validation', payload).toPromise();
  }
  // updateStatus status Api updated by Manjunath B
  async updateStatus(payload) {
    //return this.httpClient.put(this.api +'/creditlinesvc/creditlimit/updatestatus', payload).toPromise();
    return this.httpClient.post(this.api + '/lmsworkflowsvc/workflow/loanstatus/initiate', payload).toPromise();
  }
  // writtenOff status Api updated by Manjunath B
  // async writtenOff(payload){
  //   return this.httpClient.post(this.api +'/creditlinesvc/deposit/writeoff?', payload).toPromise();
  // }
  async writtenOff(param, payload) {
    //return this.httpClient.post(this.api +`/creditlinesvc/deposit/writeoff?`+param, payload).toPromise();
    return this.httpClient.post(this.api + `/lmsworkflowsvc/workflow/deposit/writeoff/initiate`, payload).toPromise();
  }
  // settledOff status Api updated by Manjunath B
  async settledOff(param, payload) {
    //return this.httpClient.post(this.api +'/creditlinesvc/deposit/settlement?'+param, payload).toPromise();
    return this.httpClient.post(this.api + '/lmsworkflowsvc/workflow/deposit/settlement/initiate', payload).toPromise();
  }
  async initiateLOSWF(payload) {
    return this.httpClient.post(this.api + '/losworkflowsvc/workflow/lead/generate', payload).toPromise();
  }
  // Get Account status Api updated by Manjunath B
  async getAccStatus(customerType, customerId) {
    return this.httpClient.get(this.api + `/creditlinesvc/creditlimit/master/spec?search=(customer.profile==${customerType} and customer.id==${customerId})`).toPromise();
  }

  async getAvailableWeightForLots(orderId) {
    return this.httpClient.get(this.api + '/cocoon/order/lots/' + orderId).toPromise();
  }
  //===================================================
  async getAvailableWeightForLotsSales(orderId) {
    return this.httpClient.get(this.SILK_API + '/cocoon/order/lots/' + orderId).toPromise();
  }
  //====================================================


  async putRetailer(id, reqObj) {
    return this.httpClient.patch(this.api + '/retailer/' + id, reqObj).toPromise();
  }
  async patchCatologColor(id, params) {
    return this.httpClient.patch(this.catalog_service + '/colorcatalog/' + id, params).toPromise();
  }
  async getCatologColorById(id) {
    return this.httpClient.get(this.catalog_service + '/colorcatalog/' + id).toPromise();
  }

  async patchCustomer(id, reqObj, enpoint) {
    return this.httpClient.patch(`${this.api}/${enpoint}/${id}`, reqObj).toPromise();
  }

  async getReelerById(reelerId) {
    return this.httpClient.get(this.api + '/reeler/' + reelerId + '?projection=reelerProjection').toPromise();
  }
  async getWeaverPOInProgressById(reelerId) {
    return this.httpClient.get(this.api + '/weaverpurchaseorder/search/postatus?poStatus=New,Processing&weaverId=' + reelerId).toPromise();
  }
  async getRetailerById(reelerId) {
    return this.httpClient.get(this.api + '/retailer/' + reelerId).toPromise();
  }
  async getRetailerPOById(reelerId) {
    return this.httpClient.get(this.api + '/retailerpurchaseorder/' + reelerId).toPromise();
  }

  async getSupplierPOById(poId) {
    return this.httpClient.get(this.api + '/supplierpurchaseorder/' + poId).toPromise();
  }
  async getallcatalogdetailsById(id) {
    return this.httpClient.get(this.api + '/catalogsvc/catalogsku/' + id).toPromise();
  }

  async getSkuOfRetailerPo(poId) {
    return this.httpClient.get(this.api + `/search/purchaseorderskus/spec?search=purchaseOrderId==${poId}`).toPromise();
  }

  async getSkuOfSupplierPo(poId) {
    return this.httpClient.get(this.api + `/search/purchaseorderskus/spec?search=purchaseOrderId==${poId}`).toPromise();
  }

  async getYarnPOById(reelerId) {
    return this.httpClient.get(this.api + '/weaverpurchaseorder/' + reelerId).toPromise();
  }
  async getYarnPOSalesById(reelerId) {
    return this.httpClient.get(this.api + '/weaverpurchaseorder/' + reelerId + '/yarnOrders').toPromise();
  }

  async getUserDetailsByPhone(phone) {
    return this.httpClient.get(this.api + '/user/search/phone?phone=' + phone).toPromise();
  }

  async markCocoonLotAsSold(reqObj) {
    return this.httpClient.post(this.SILK_API + '/cocoonorder', reqObj).toPromise();
  }

  async patchCocoonOrder(reqObj, id) {
    return this.httpClient.patch(this.SILK_API + '/cocoonorder/' + id, reqObj).toPromise();
  }

  async deleteCocoonOrder(id) {
    return this.httpClient.delete(this.SILK_API + '/cocoonorder/' + id).toPromise();
  }

  async getOrdersOfReeler(reelerId) {
    return this.httpClient.get(this.api + '/reeler/' + reelerId + '/cocoonorders').toPromise();
  }
  async getOrdersOfWeaver(reelerId) {
    return this.httpClient.get(this.api + '/weaver/' + reelerId + '/yarnorders').toPromise();
  }
  async getSkubatchesOfWeaver(weaverId) {
    return this.httpClient.get(`${this.api}/weaver/${weaverId}/skubatches`).toPromise();
  }
  async postWeaverPurchaseOrder(reqObj) {
    return this.httpClient.post(this.api + '/weaverpurchaseorder', reqObj).toPromise();
  }
  async postSKUPurchaseOrder(reqObj) {
    return this.httpClient.post(this.api + '/weaverskupurchaseorder', reqObj).toPromise();
  }
  async postRetailerPurchaseOrder(reqObj) {
    return this.httpClient.post(this.api + '/purchaseorder', reqObj).toPromise();
  }

  async payReelerDueAmount(reqObj) {
    return this.httpClient.post(this.api + '/reelerpayment', reqObj).toPromise();
  }
  //--Changed Cocoon-reelerpayment api//---------
  async payReelerDueAmountOfCocoon(reqObj) {
    return this.httpClient.post(this.SILK_API + '/reelerpayment', reqObj).toPromise();
  }
  //--------------------------------------//
  async payReelerDueAmountFromMudra(reqObj) {
    return this.httpClient.post(this.api + '/creditlinesvc/creditline', reqObj).toPromise();
  }
  async saveCustomersForMudra(reqObj) {
    return this.httpClient.post(this.api + '/creditlinesvc/customer', reqObj).toPromise();
  }

  async syncKycDocs(reqObj) {
    return this.httpClient.post(this.api + '/mudracustomersvc/document/sync', reqObj).toPromise();
  }

  async patchCustomersForMudra(id, reqObj) {
    return this.httpClient.patch(this.api + '/creditlinesvc/customer/' + id, reqObj).toPromise();
  }

  async getCustomersForMudra(searchQuery) {
    return this.httpClient.get(this.api + '/creditlinesvc/customer/spec?search=' + searchQuery).toPromise();
  }

  async postRetailerDeposits(reqObj) {
    return this.httpClient.post(this.api + '/stlmntsvc/deposit', reqObj).toPromise();
  }
  async postRetailerDepositSettlement(reqObj) {
    return this.httpClient.post(this.api + '/stlmntsvc/settlement', reqObj).toPromise();
  }
  async payWeaverDueAmount(reqObj) {
    return this.httpClient.post(this.api + '/weaverpayment', reqObj).toPromise();
  }

  async reelerPayout(reqObj) {
    return this.httpClient.post(this.api + '/reelerpayout', reqObj).toPromise();
  }


  async payRetailerrDueAmount(reqObj) {
    return this.httpClient.post(this.api + '/retailerpayment', reqObj).toPromise();
  }

  async getKhathaListofReeler(reelerId) {
    return this.httpClient.get(this.api + '/reeler/' + reelerId + '/reelerpayments?sort=createdDate,desc').toPromise();
  }
  // get apis by id
  async getUserById(id) {
    return this.httpClient.get(this.api + '/user/' + id).toPromise();
  }
  async getCenterById(id) {
    return this.httpClient.get(this.api + '/center/' + id).toPromise();
  }
  async getWarehouseById(id) {
    return this.httpClient.get(this.api + '/warehouse/' + id).toPromise();
  }
  async gstByWarehouse(id) {
    return this.httpClient.get(`${this.api}/warehouse/${id}/gstDetails`).toPromise();
  }
  async getWarehouseBySalesOrderId(id) {
    return this.httpClient.get(`${this.api}/salesorder/${id}/warehouse`).toPromise();
  }
  async getSkuBatchWarehouseById(id) {
    return this.httpClient.get(`${this.api}/skubatch/${id}/warehouse`).toPromise();

  }
  // update apis
  async updateUser(id, params) {
    return this.httpClient.patch(this.api + '/user/' + id, params).toPromise();
  }
  async updateCenter(id, params) {
    return this.httpClient.patch(this.api + '/center/' + id, params).toPromise();
  }
  async patchCenter(id, param) {
    return this.httpClient.patch(this.api + '/center/' + id, param).toPromise();
  }

  async updateWarehouse(id, params) {
    return this.httpClient.patch(this.api + '/warehouse/' + id, params).toPromise();
  }

  async patchMandi(id, reqobj) {
    return this.httpClient.patch(this.api + '/mandi/' + id, reqobj).toPromise();
  }

  // Delete Apis
  async deleteMandi(id) {
    return this.httpClient.delete(this.api + '/mandi/' + id).toPromise();
  }
  async deleteYarnMandi(id) {
    return this.httpClient.delete(this.api + '/yarnrates/' + id).toPromise();
  }
  async deleteUser(id) {
    return this.httpClient.delete(this.api + '/users/' + id).toPromise();
  }
  async deleteCenter(id) {
    return this.httpClient.delete(this.api + '/center/' + id).toPromise();
  }
  async deleteFarmMrktPlc(id) {
    return this.httpClient.delete(this.api + '/farmermarketplace/' + id).toPromise();
  }
  async deleteFarmAdvisory(id) {
    return this.httpClient.delete(this.api + '/cocoonlifecycle/' + id).toPromise();
  }
  async deleteRmFeed(id) {
    return this.httpClient.delete(this.api + '/rmfeed/' + id).toPromise();
  }
  async deleteFarmer(id) {
    return this.httpClient.delete(this.api + '/farmer/' + id).toPromise();
  }

  async getFarmerById(id) {
    return this.httpClient.get(this.api + '/farmer/' + id + '?projection=farmerProjection').toPromise();
  }
  async getPupaeSupplierById(id) {
    return this.httpClient.get(this.PUPAE_API + '/pupaesupplier/' + id).toPromise();
  }
  async getPupaeBuyererById(id) {
    return this.httpClient.get(this.PUPAE_API + '/pupaebuyer/' + id).toPromise();
  }
  async getFarmMarketPlaceById(id) {
    return this.httpClient.get(this.api + '/farmermarketplace/' + id + '?projection=farmerProjection').toPromise();
  }
  async getFarmAdvisoriesById(id) {
    return this.httpClient.get(this.api + '/cocoonlifecycle/' + id + '?projection=farmerProjection').toPromise();
  }
  async getRmFeedsById(id) {
    return this.httpClient.get(this.api + '/rmfeed/' + id + '?projection=farmerProjection').toPromise();
  }
  async getRmBannerById(id) {
    return this.httpClient.get(this.api + '/catalogsvc/mobilebanner/' + id).toPromise();
  }
  async uploadMktPlaceImages(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFiles', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/farmermarketplaceimages/', formData, options).subscribe(data => {
    });
  }
  async uploadRetailersLogo(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFile', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/retaileronboardinglogo/', formData, options).subscribe(data => {
    });
  }
  async uploadrmFeedImages(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFile', file);
    formData.append('rmfeedIdVal', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/rmfeedimage', formData, options).subscribe(data => {
    });
  }
  async uploadAdvisoryImages(files, id) {
    let formData: FormData = new FormData();
    for (const file in files) {
      formData.append('multipartFiles', files[file]);

    }
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/cocoonlifecycleimages/', formData, options).subscribe(data => {
    });
  }
  async uploadYarnListImages(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFile', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/yarnlistingceritificateimage/', formData, options).subscribe(data => {
    });
  }
  async uploadWeaverListImages(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFile', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/weaverskupopdf/', formData, options).subscribe(data => {
    });
  }
  async uploadSKUPoImage(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFile', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/weaverskupopdf/', formData, options).subscribe(data => {
    });
  }
  async uploadRetailerListImages(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFile', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/retailerpopdf/', formData, options).subscribe(data => {
    });
  }
  async uploadProfileImages(file, id, role) {
    let formData: FormData = new FormData();
    formData.append('multipartFile', file);
    formData.append('customerIdVal', id);
    formData.append('role', role);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/profilepic/', formData, options).subscribe(data => {
    });
  }
  async uploadBulkCsv(file) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    // headers.append('Accept', 'application/json');
    // headers.append('responseType', 'text');
    // let options = { headers: headers,responseType: 'text' };
    return this.httpClient.post(`${this.api}/upload/followup`, formData, { headers, responseType: 'text' }).toPromise();
  }

  async uploadSKUBatchCsv(file) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    // headers.append('Accept', 'application/json');
    // headers.append('responseType', 'text');
    // let options = { headers: headers,responseType: 'text' };
    return this.httpClient.post(`${this.api}/upload/sku/validate`, formData, { headers }).toPromise();
  }

  async uploadFollowUpNotesImage(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFile', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/followupnotesimage', formData, options).subscribe(data => {
    });
  }
  async uploadMudraFollowUpNotesImage(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFile', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/mudrafollowupsvc/followupnotesimage', formData, options).subscribe(data => {
    });
  }

  async getWeaverById(id) {
    return this.httpClient.get(this.api + '/weaver/' + id + '?projection=weaverProjection').toPromise();
  }
  async weaverGSTVerification(gstNumber) {
    return this.httpClient.get(this.api + `/kycsvc/kyc/gst?gstin=${gstNumber}`).toPromise();
  }
  async getWeaverPOById(id) {
    return this.httpClient.get(this.api + `/weaverpurchaseorder/${id}`).toPromise();
  }

  async getSKUPOById(id) {
    return this.httpClient.get(this.api + `/weaverskupurchaseorder/${id}`).toPromise();
  }

  async getAllWeaverPurchaseOrder() {
    return this.httpClient.get(this.api + '/weaverpurchaseorder?sort=createdDate,desc').toPromise();
  }
  async getAllWeaverSKUPurchaseOrder() {
    return this.httpClient.get(this.api + '/weaverskupurchaseorder?sort=createdDate,desc').toPromise();
  }
  async putWeaverPurchaseOrder(id, params) {
    return this.httpClient.patch(this.api + '/weaverpurchaseorder/' + id, params).toPromise();
  }
  async putSKUPurchaseOrder(id, params) {
    return this.httpClient.patch(this.api + '/weaverskupurchaseorder/' + id, params).toPromise();
  }
  async putRetailerPurchaseOrder(id, params) {
    return this.httpClient.patch(this.api + '/retailerpurchaseorder/' + id, params).toPromise();
  }

  async getYarnListById(id) {
    return this.httpClient.get(this.api + '/yarnorder/' + id + '/yarnlisting').toPromise();
  }
  async getSalesOrderListById(id) {
    return this.httpClient.get(this.api + '/retailer/' + id + '/salesorder').toPromise();
  }

  async getFarmerkhata(id) {
    return this.httpClient.get(this.api + '/farmer/' + id + '/cocoonlots').toPromise();
  }

  getReelerKhata(cocoonId) {
    return this.httpClient.get(this.api + '/cocoonorder/' + cocoonId + '/reelerPayments?sort=createdDate,desc').toPromise();
  }
  //----------------
  getCocoonReelerKhataforPayments(id) {
    return this.httpClient.get(this.SILK_API + '/cocoonorder/' + id + '/reelerPayments?sort=lastModifiedDate,asc').toPromise();
  }
  //----------------------

  getWeaverKhata(yarnId) {
    return this.httpClient.get(this.api + '/yarnorder/' + yarnId + '/weaverpayment').toPromise();
  }
  getRetailererKhata(yarnId) {
    return this.httpClient.get(this.api + '/salesorder/' + yarnId + '/retailerpayment').toPromise();
  }

  async getCocoonOrders() {
    return this.httpClient.get(this.api + '/cocoonorder?sort=createdDate,desc').toPromise();
  }
  async getAllRoles() {
    return this.httpClient.get(this.api + '/role/search/notin?roles=Farmer,Reeler,Weaver,Retailer,Chawki').toPromise();
  }

  async getCocoonOrdersByStatus(status) {
    if (status != 'all') {
      return this.httpClient.get(this.api + '/cocoonorder/search/orderpaymentstatus?status=' + status + '&sort=createdDate,desc').toPromise();
    } else {
      return this.httpClient.get(this.api + '/cocoonorder?sort=createdDate,desc').toPromise();
    }

  }
  async getYarnOrdersByStatus(status) {
    if (status != 'all') {
      return this.httpClient.get(this.api + '/yarnorder/search/orderpaymentstatus?status=' + status + '&sort=createdDate,desc').toPromise();
    } else {
      return this.httpClient.get(this.api + '/yarnorder?sort=createdDate,desc').toPromise();
    }

  }
  async getSalesOrdersByStatus(paymentStatus, orderStatus) {
    return this.httpClient.get(this.api + '/salesorder/search/statusin?orderstatus=' + orderStatus + '&paymentstatus=' + paymentStatus + '&sort=createdDate,desc').toPromise();
  }

  async getSalesOrderReturnSkus(id) {
    return this.httpClient.get(this.api + '/retailersoreturn/skus/' + id).toPromise();
  }

  async getCocoonOrderById(id) {
    return this.httpClient.get(this.SILK_API + '/cocoonorder/' + id).toPromise();
  }
  async getYarnOrderById(id) {
    return this.httpClient.get(this.api + '/yarnorder/' + id).toPromise();
  }

  async getDraftYarnOrderById(id) {
    return this.httpClient.get(this.api + '/yarnorder/draft/' + id).toPromise();
  }

  async getOurchaseOrderById(id) {
    return this.httpClient.get(this.api + '/yarnorder/' + id + '/weaverPurchaseOrder').toPromise();
  }
  async getSalesOrderById(id) {
    return this.httpClient.get(this.api + '/salesorder/' + id).toPromise();
  }

  async returnSkuSalesOrder(reqObj) {
    return this.httpClient.post(this.api + '/retailersalesreturn', reqObj).toPromise();
  }
  async returnSkuToWeaver(reqObj) {
    return this.httpClient.post(this.api + '/weaverreturnorder', reqObj).toPromise();
  }

  async downloadSalesOrderSku(id) {
    return this.httpClient.get(`${this.api}/retailersoreturn/download/${id}`, { responseType: 'arraybuffer' }).toPromise();
  }

  async uploadSalesOrderCsv(file, id) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.httpClient.post(`${this.api}/retailersoreturn/sku/validate`, formData, { headers }).toPromise();
  }

  /** ANALYTICS APIS */

  async getCocoonLotsAnalytics() {
    return this.httpClient.get(this.SILK_API + '/analytics/cocoonlot').toPromise();
  }

  async getTotalsAnalytics() {
    return this.httpClient.get(this.SILK_API + '/analytics/dashboard/totals').toPromise();
  }

  async lotOrderDetails(lotId) {
    return this.httpClient.get(this.api + '/cocoon/lots/order/' + lotId).toPromise();
  }

  async getCocoonOrderDetails(lotId) {
    // return this.httpClient.get(this.api + '/cocoonlot/' + lotId + '/cocoonOrder?projection=cocoonorderProjection').toPromise();
    return this.httpClient.get(this.api + '/cocoonorder/search/ordersforlots?cocoonLotId=' + lotId + '&sort=createdDate,desc').toPromise();

  }

  /** FARMER FOLLOWUP APIS */
  async getFarmerFollowupList(param) {
    return this.httpClient.get(this.api + '/farmerfollowup/search/status?status=' + param + '&sort=createdDate,desc').toPromise();
  }

  async updateFarmerFollowup(id, params) {
    return this.httpClient.patch(this.api + '/farmerfollowup/' + id, params).toPromise();
  }


  /** FARMER FOLLOWUP APIS */
  async getFarmerMarketPlaceOrders(status) {
    if (status) {
      return this.httpClient.get(this.api + '/farmerinputorder/search/status?status=' + status + '&sort=createdDate,desc').toPromise();
    } else {
      return this.httpClient.get(this.api + '/farmerinputorder?sort=createdDate,desc').toPromise();
    }
  }

  async updateFarmerMarketPlaceOrder(id, params) {
    return this.httpClient.patch(this.api + '/farmerinputorder/' + id, params).toPromise();
  }


  /** DELETE COCOON ORDER BY ID */
  async deleteCocoonOrderById(cocoonOrderId) {
    return this.httpClient.delete(this.SILK_API + '/cocoonorder/' + cocoonOrderId).toPromise();
  }
  async deleteYarnOrderById(yarnOrderId) {
    return this.httpClient.delete(this.api + '/yarnorder/' + yarnOrderId).toPromise();
  }
  async deleteSalesOrderById(yarnOrderId) {
    return this.httpClient.delete(this.api + '/salesorder/' + yarnOrderId).toPromise();
  }

  /** DELETE COCOON LOT BY ID */
  async deleteCocoonLotById(lotId) {
    return this.httpClient.delete(this.api + '/cocoonlot/' + lotId).toPromise();
  }

  // UPDATE COCOON LOT
  async updateCocoonLotById(lotId, param) {
    return this.httpClient.patch(this.SILK_API + '/cocoonlot/' + lotId, param).toPromise();
  }
  async updateFarmMktPlaceById(id, param) {
    return this.httpClient.patch(this.api + '/farmermarketplace/' + id, param).toPromise();
  }
  async updatermFeedById(id, param) {
    return this.httpClient.patch(this.api + '/rmfeed/' + id, param).toPromise();
  }
  async updateBannerById(id, param) {
    return this.httpClient.patch(this.api + '/catalogsvc/mobilebanner/' + id, param).toPromise();
  }
  async cocoonSplitedlots(id) {
    return this.httpClient.get(this.SILK_API + '/cocoonlot/search/splitted?parentLotId=' + id).toPromise();
  }

  // async cocoonLotPayment(param) {
  //   return this.httpClient.post(this.api + '/farmerpayout/', param).toPromise();

  // }
  async cocoonLotPayment(param) {
    return this.httpClient.post(this.SILK_API + '/farmerpayout', param).toPromise();

  }

  // verify and redeem coupon

  async verifyCoupon(code, farmerId, totalPrice, target) {
    return this.httpClient.get(this.api + '/coupon/verify/' + code + '/' + farmerId + '/' + totalPrice + '?target=' + target).toPromise();
  }

  async redeemCoupon(code, farmerId) {
    return this.httpClient.post(this.api + '/coupon/redeem/' + code + '/' + farmerId, {}).toPromise();
  }

  // yarn
  async createYarn(param) {
    return this.httpClient.post(this.api + '/yarnlisting', param).toPromise();
  }
  async createYarnLot(param) {
    return this.httpClient.post(this.yarnLotAPI + '/yarn/procurement/yarnlot', param).toPromise();
  }

  async updateYarnLot(yarnLotId, params) {
    return this.httpClient.patch(this.yarnLotAPI + '/yarn/procurement/yarnlot/' + yarnLotId, params).toPromise();
  }

  async cancelYarnLotBooking(yarnLotId, params) {
    return this.httpClient.patch(this.yarnLotAPI + '/yarn/procurement/yarnlot/cancel/' + yarnLotId, params).toPromise();
  }

  async createYarnStage(param, requestId, approvalStatus) {
    return this.httpClient.post(this.yarnLotAPI + '/yarn/procurement/yarnstage?requestId=' + requestId + '&status=' + approvalStatus, param).toPromise();
  }

  async updateYarnStage(stageId, param) {
    return this.httpClient.patch(this.yarnLotAPI + '/yarn/procurement/yarnstage/' + stageId, param).toPromise();
  }

  async updateYarnTwistingStage(stageId, param) {
    return this.httpClient.patch(this.yarnLotAPI + '/yarntwisting/yarntwistingstage/' + stageId, param).toPromise();
  }

  async updateYarnTwistingNegotiated(id, param) {
    return this.httpClient.patch(this.yarnLotAPI + '/yarntwisting/negotiated/' + id, param).toPromise();
  }

  async createTwistingPayout(reqObj) {
    return this.httpClient.post(this.yarnLotAPI + '/yarntwisting/payout', reqObj).toPromise();
  }

  async getYarnLotStages(searchParams) {
    const searchQuery = `search=${searchParams}`;
    return this.httpClient.get(this.yarnLotAPI + "/yarn/procurement/yarnstage?" + searchQuery).toPromise();
  }

  async getAllYarn(status) {
    if (status) {
      return this.httpClient.get(this.api + '/yarnlisting/search/status?status=' + status + '&sort=createdDate,desc').toPromise();
    } else {
      return this.httpClient.get(this.api + '/yarnlisting?sort=createdDate,desc').toPromise();
    }
  }

  async updateYarn(id, params) {
    return this.httpClient.patch(this.api + '/yarnlisting/' + id, params).toPromise();
  }



  async getYarnById(id) {
    return this.httpClient.get(this.api + '/yarnlisting/' + id + '?projection=yarnListingProjection').toPromise();
  }

  async getYarnLotById(id) {
    return this.httpClient.get(this.yarnLotAPI + '/yarn/procurement/yarnlot/' + id + '?projection=yarnListingProjection').toPromise();
  }

  async deleteYarnById(id) {
    return this.httpClient.delete(this.api + '/yarnlisting/' + id).toPromise();
  }

  async markYarnAsSold(reqObj) {
    return this.httpClient.post(this.api + '/yarnorder/placeorder', reqObj).toPromise();
  }

  async createDraftOrderForYarn(reqObj) {
    return this.httpClient.post(this.api + '/yarnorder/draft', reqObj).toPromise();
  }

  async updateDraftOrderForYarn(id, reqObj) {
    return this.httpClient.patch(this.api + '/yarnorder/draft/' + id, reqObj).toPromise();
  }

  async markYarnAsSoldUpdate(yarnOrderId: number, reqObj) {
    return this.httpClient.patch(this.api + '/yarnorder/' + yarnOrderId, reqObj).toPromise();
  }

  async markSKUAsSold(reqObj) {
    return this.httpClient.post(this.api + '/salesorder', reqObj).toPromise();
  }

  async patchRetailerSalesOrder(reqObj, id) {
    return this.httpClient.patch(this.api + '/salesorder/' + id, reqObj).toPromise();
  }

  async getYarnOrderForSoldYarn(yarnId) {
    return this.httpClient.get(this.api + '/yarnorder/search/orderforlisting?yarnlistingid=' + yarnId + '&page=0&size=100&sort=createdDate,desc').toPromise();
  }

  async getYarnListingPayment(id) {
    return this.httpClient.get(this.api + '/reelerpayout/search/yarnlisting?yarnlistingid=' + id).toPromise();
  }

  async getTwistingOrderPayment(id) {
    return this.httpClient.get(this.api + '/yarn/twisting/' + id).toPromise();
  }

  async getYarnLotPayments(id) {
    return this.httpClient.get(this.api + '/search/reelerpayoutreport/spec?search=yarnLotId==' + id + '&page=0&size=100&sort=createdDate,desc').toPromise();
  }

  reelerYarnKhata(reelerId) {
    return this.httpClient.get(this.api + '/reeler/' + reelerId + '/yarnlisting').toPromise();
  }

  // cocoon and lot payment analytics

  paymentAnalytics() {
    return this.httpClient.get(this.SILK_API + '/analytics/payblesrecievables').toPromise();
  }

  // yarn analytics
  getYarnAnalytics() {
    return this.httpClient.get(this.api + '/analytics/yarnlisting').toPromise();
  }

  // followUps

  createFollowUp(reqObj) {
    return this.httpClient.post(this.api + '/followup', reqObj).toPromise();
  }
  createMudraFollowUp(reqObj) {
    return this.httpClient.post(this.api + '/mudrafollowupsvc/followup', reqObj).toPromise();
  }
  createFollowUpNotes(reqObj) {
    return this.httpClient.post(this.api + '/followupnotes', reqObj).toPromise();
  }
  createMudraFollowUpNotes(reqObj) {
    return this.httpClient.post(this.api + '/mudrafollowupsvc/followupnotes', reqObj).toPromise();
  }
  makeDepositForMudra(params, accountId, productType, depositType?: string) {
    if (depositType == 'WAIVE_OFF') {
      return this.httpClient.post(`${this.api}/lmsworkflowsvc/workflow/deposit/waiveoff/initiate`, params).toPromise();

    } else {
      return this.httpClient.post(`${this.api}/lmsworkflowsvc/workflow/deposit/initiate`, params).toPromise();

    }
    //return this.httpClient.post(`${this.api}/creditlinesvc/deposit?&accountId=${accountId}`, params).toPromise();
  }
  makePreClosureDepositForMudra(params, accountId, productType) {
    return this.httpClient.post(`${this.api}/lmsworkflowsvc/workflow/preclosure/initiate`, params).toPromise();
  }
  getFollowUpNotes(id) {
    return this.httpClient.get(this.api + '/followup/' + id + '/followupnotes').toPromise();
  }
  getMudraFollowUpNotes(id) {
    return this.httpClient.get(this.api + '/mudrafollowupsvc/followup/' + id + '/followupnotes').toPromise();
  }

  createWeaverPONotes(reqObj) {
    return this.httpClient.post(this.api + '/weaverponotes', reqObj).toPromise();
  }

  createYarnPONotes(reqObj) {
    return this.httpClient.post(this.api + '/yarnordernote', reqObj).toPromise();
  }

  getPoNotesImageS3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/weaverpo_notes?extension=.${extension}&id=${id}`).toPromise()
  }
  getLoanInvoiceDetails(loanId) {
    return this.httpClient.get(`${this.api}/creditlinesvc/customer/invoice/spec?search=(loanId==${loanId})&page=0&size=10&sort=createdDate,desc`).toPromise()
  }
  getLoanInvoice(loanId) {
    return this.httpClient.get(`${this.api}/creditlinesvc/customer/invoice/document/${loanId}/type/INVOICE`).toPromise()
  }

  getYarnOrderNotesImageS3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/yarnOrder_notes?extension=.${extension}&id=${id}`).toPromise()
  }

  getWeaverPoNotes(id) {
    return this.httpClient.get(this.api + '/weaverpurchaseorder/' + id + '/notes').toPromise();
  }

  getYarnOrderNotes(id) {
    return this.httpClient.get(this.api + '/yarnorder/' + id + '/notes').toPromise();
  }

  getAllFollowups(customerType, followUpType, status) {
    return this.httpClient.get(this.api + '/followup/search/statustypeandcustomer?status='
      + status + '&type=' + followUpType + '&customerType=' + customerType + '&sort=lastModifiedDate,desc').toPromise();
  }

  updateFollowUp(param, id) {
    return this.httpClient.patch(this.api + '/followup/' + id, param).toPromise();
  }
  updateMudraFollowUp(param, id) {
    return this.httpClient.patch(this.api + '/mudrafollowupsvc/followup/' + id, param).toPromise();
  }

  getFollowUpById(id) {
    return this.httpClient.get(this.api + '/followup/' + id).toPromise();
  }

  getFollowUpByPhone(phone) {
    return this.httpClient.get(this.api + '/followup/search/assignedtophone?phone=' + phone + '&sort=lastModifiedDate,desc').toPromise();
  }

  getCustomerFollowUp(customerId) {
    return this.httpClient.get(this.api + '/followup/search/customerid?id=' + customerId + '&sort=lastModifiedDate,desc').toPromise();
  }

  updateBulkFollowups(params) {
    return this.httpClient.patch(this.api + '/followup/reassign', params).toPromise();
  }
  updateBulkFollowupsMudra(params) {
    return this.httpClient.patch(this.api + '/mudrafollowupsvc/followup/reassign', params).toPromise();
  }

  // logistics

  dispatchCocoonLots(param) {
    return this.httpClient.post(this.logistic_api + '/cocoonlotlogistics', param).toPromise();
  }
  dispatchShipmentCocoonLots(param) {
    return this.httpClient.post(this.logistic_api + '/shipment/', param).toPromise();
  }
  // logistics/transportationtype/spec
  getTransportType() {
    return this.httpClient.get(this.logistic_api + '/logistics/transportationtype/spec').toPromise();
  }
  getVehicleCapacityType() {
    return this.httpClient.get(this.logistic_api + '/logistics/vehiclecapacityutilisationtype/spec').toPromise();
  }
  getVehicleType() {
    return this.httpClient.get(this.logistic_api + '/logistics/logisticsvehicletype/spec').toPromise();
  }
  createPayout(params) {
    return this.httpClient.post(this.PAYOUT + '/payoutapproval/createticket', params).toPromise();
  }
  Updatepayoutrequest(payload) {
    return this.httpClient.post(this.PAYOUT + '/payoutapproval/updatestatus', payload).toPromise();
  }
  UpdateFinancepayoutrequest(payload, requestID) {
    const headers = new HttpHeaders()
      .set('x-otp-requestId', requestID);
    return this.httpClient.post(this.PAYOUT + '/payoutapproval/updatestatus', payload, { 'headers': headers }).toPromise();
  }


  postYarntwisting(payload) {
    return this.httpClient.post(this.yarnLotAPI + '/yarntwisting/create', payload).toPromise();
  }

  postSplitYarntwisting(payload) {
    return this.httpClient.post(this.api + '/yarnlisting/create', payload).toPromise();
  }
  patchYarntwisting(payload, id) {
    return this.httpClient.patch(`${this.api}/yarntwisting/${id}`, payload).toPromise();
  }

  getYarnTwistingForYarn(id) {
    return this.httpClient.get(`${this.api}/yarntwisting/${id}`).toPromise();
  }

  getAllDispatchedLots(status) {
    if (status) {
      return this.httpClient.get(this.api + '/cocoonlotlogistics/search/paymentstatus?status=' + status).toPromise();
    } else {
      return this.httpClient.get(this.api + '/cocoonlotlogistics?sort=createdDate,desc').toPromise();
    }
  }

  updateLogisticsDetails(id, param) {
    return this.httpClient.patch(this.logistic_api + '/shipment/' + id, param).toPromise();
  }

  deleteLogistics(id) {
    return this.httpClient.delete(this.logistic_api + '/cocoonlotlogistics/' + id).toPromise();
  }

  // Export APIs
  exportDownLoadReports(fromDate, toDate, endPointUrl, vertical) {
    let refUrl = this.api;
    switch (vertical) {
      case "COTTON":
        refUrl = this.COTTON_API;
        break;
      case "CRC":
        refUrl = this.chawki_api;
      default:
        refUrl = this.api;
    }

    return this.httpClient.get(`${refUrl}/report/${endPointUrl}&fromDate=${fromDate}&toDate=${toDate}`, { responseType: 'arraybuffer' }).toPromise();
  }
  exportDownLoadReportsSpec(fromDate, toDate, endPointUrl, serachQuery = false, datePlaceHolder = 'createdDate', vertical) {
    if (endPointUrl.includes('yarnpurchase/transactional')) {
      datePlaceHolder = 'purchasedDate'

    }
    let refUrl = this.api;
    let query = `${datePlaceHolder}>=${fromDate} and ${datePlaceHolder}<=${toDate}&sort=${endPointUrl.includes('yarnpurchase/transactional') ? 'purchasedDate' : 'createdDate'},desc`;
    serachQuery && (query = `${datePlaceHolder}>=${fromDate} and ${datePlaceHolder}<=${toDate} ${serachQuery}`);
    switch (vertical) {
      case "MUDRA":
        refUrl = `${this.api}`;
        break;
      case "COTTON":
      case "COTTONBALES":
        refUrl = `${this.COTTON_API}/report`;
        return this.httpClient.get(`${refUrl}/${endPointUrl}search=${query}`).toPromise();
        break;
      case "PUPAE":
        refUrl = `${this.PUPAE_API}/report`;
        return this.httpClient.get(`${refUrl}/${endPointUrl}search=${query}`).toPromise();
        break;
      case "YARNLOTS":
        refUrl = `${this.YARN_API}`;
        break;
      case "COCOON":
        refUrl = `${this.api}`;
        break;
      case "CRC":
        refUrl = `${this.chawki_api}`;
        break;
      case "COCOONLOGISTICS":
        refUrl = `${this.api}`;
        break;
      default:
        refUrl = `${this.api}/report`;
    }
    // let query =`${datePlaceHolder}>=${fromDate} and ${datePlaceHolder}<=${toDate}&sort=createdDate,desc`;
    // serachQuery &&(query =`${datePlaceHolder}>=${fromDate} and ${datePlaceHolder}<=${toDate} ${serachQuery}`);

    return this.httpClient.get(`${refUrl}/${endPointUrl}${endPointUrl.includes('yarnpurchase/transactional') ? '' : 'search='}${query}`, { responseType: 'arraybuffer' }).toPromise();
  }

  exportCocoonPurchases(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/cocoonlots?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportWeavers(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/weavers?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportYarnPurchases(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/yarnlistings?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportChawki(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/chawkis?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportCocoonSales(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/cocoonorders?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportCocoonLogistic(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/cocoonlogistics?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportReelers(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/reelers?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportYarnSales(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/yarnorders?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportRetailers(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/retailers?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportFarmerReport(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/farmers?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportInputReport(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/farmermarketplace?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportChawkiOrdersReport(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/chawkiorders?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportRetailerSalesReport(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/retailersorder?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  exportweaverSKUBatchReport(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/weaverskubatch?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise();
  }
  downloadReportDataFile(reportId) {
    return this.httpClient.get(this.api + '/reportdata/download/' + reportId).toPromise();
  }
  //cocoon_logestic report
  downloadLogesticReportDataFile(reportId) {
    return this.httpClient.get(this.api + '/logisticssvc/report/' + reportId).toPromise();
  }
  // farm Dashboard

  getCocoonSoldWastage(fromDate, toDate) {
    return this.httpClient.get(this.SILK_API + '/analytics/cocoonlot/wastage?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getCocoonLotAnalytics() {
    return this.httpClient.get(this.SILK_API + '/analytics/cocoonlot').toPromise()
  }

  getCocoonLotTrend(fromDate, toDate) {
    return this.httpClient.get(this.SILK_API + '/analytics/cocoonlot/trends?fromDate=' + fromDate +'&toDate=' + toDate).toPromise()
  }

  getWeightByCenter(fromDate, toDate) {
    return this.httpClient.get(this.SILK_API + '/analytics/cocoonlots/weightbycenter?fromDate=' + fromDate +'&toDate=' + toDate).toPromise()
  }

  getProcuredAndSoldWeightByCenter(fromDate, toDate) {
    return this.httpClient.get(this.SILK_API + '/analytics/cocoonlot/procuredandsoldweightbycenter?fromDate=' + fromDate +'&toDate=' + toDate).toPromise()
  }

  getCocoonLogisticsExpenses(fromDate, toDate) {
    return this.httpClient.get(this.SILK_API + '/analytics/cocoonlot/logisticsexpenses?fromDate=' + fromDate +'&toDate=' + toDate).toPromise()
  }

  getLogisticsExpensesByCenter(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/cocoonlots/logisticsexpensebycenter?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getYarnLotTrend(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/yarnlisting/trends?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getYarnWeightByCenter(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/yarnlisting/weightbycenter?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  searchAllByPhoneAndType(phone, type) {
    return this.httpClient.get(this.api + '/search/phone/' + phone + '?type=' + type).toPromise();
  }
  searchAllWeaverByPhoneAndType(phone) {
    return this.httpClient.get(this.api + '/weaver/search/phone?phone=' + phone).toPromise();
  }

  getYarnLogisticsExpennses(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/yarnlisting/logisticsexpenses?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  updateCocoonLogistics(reqObj, id) {
    return this.httpClient.patch(this.logistic_api + '/shipment/' + id, reqObj).toPromise();
  }

  async farmerMobileAnalytics() {
    return this.httpClient.get(this.api + '/analytics/farmer/mobile').toPromise()
  }

  async reelerMobileAnalytics() {
    return this.httpClient.get(this.api + '/analytics/reeler/mobile').toPromise()
  }

  async weaverMobileAnalytics() {
    return this.httpClient.get(this.api + '/analytics/weaver/mobile').toPromise()
  }

  async retailerMobileAnalytics() {
    return this.httpClient.get(this.api + '/analytics/retailer/mobile').toPromise()
  }

  async chawkiMobileAnalytics() {
    return this.httpClient.get(this.api + '/analytics/chawki/mobile').toPromise()
  }

  async createCoupon(reqObj) {
    return this.httpClient.post(this.api + '/promotionalcoupon', reqObj).toPromise()
  }

  async getAllCoupons() {
    return this.httpClient.get(this.api + '/coupon/getpromotionalcoupons').toPromise()
  }

  async getAllCouponByCustomer(type) {
    return this.httpClient.get(this.api + '/promotionalcoupon/search/applicablefor?applicablefor=' + type).toPromise()
  }

  getReferralCouponOfFarmer(farmerId) {
    return this.httpClient.post(this.api + '/coupon/generate/appinstall/' + farmerId, {}).toPromise()
  }

  async getCouponById(id) {
    return this.httpClient.get(this.api + '/promotionalcoupon/' + id).toPromise()
  }

  async updateCoupon(id, reqObj) {
    return this.httpClient.patch(this.api + '/promotionalcoupon/' + id, reqObj).toPromise()
  }

  async deleteCouponCode(id) {
    return this.httpClient.delete(this.api + '/promotionalcoupon/' + id).toPromise()
  }

  async getReferralCoupons() {
    return this.httpClient.get(this.api + '/referralcoupon?sort=createdDate,desc').toPromise()
  }

  // chawki

  async chawkiOnBoarding(param) {
    return this.httpClient.post(this.api + '/chawki/', param).toPromise()
  }

  // async getChawkiList() {
  //   return this.httpClient.get(this.api + '/chawki/?sort=createdDate,desc').toPromise()
  // }

  async getAllChawkis() {
    return this.httpClient.get(this.api + '/chawki/?sort=createdDate,desc').toPromise()
  }

  async getChawkiList(search: any = false, column = 'createdDate', sortType = 'desc', page = 0, size = 10) {
    const searchQuery = search ? `search=${search}&page=${page}&size=${size}&sort=${column},${sortType}` : `page=${page}&size=${size}&sort=${column},${sortType}`;
    return this.httpClient.get(`${this.api}/search/chawki/spec?${searchQuery}`).toPromise();
  }

  async updateChawki(reqObj, id) {
    return this.httpClient.patch(this.api + '/chawki/' + id, reqObj).toPromise();
  }

  async getChawkiById(id) {
    return this.httpClient.get(this.api + '/chawki/' + id).toPromise();
  }
  async getCBedDisinfectantsEnums() {
    return this.httpClient.get(this.api + '/enums/beddisinfectant').toPromise();
  }

  async deleteChawki(id) {
    return this.httpClient.delete(this.api + '/users/' + id).toPromise();
  }

  async createChawkiOrder(reqObj) {
    // return this.httpClient.post(this.api + '/chawkiorder/', reqObj).toPromise()
    return this.httpClient.post(this.chawki_api + '/chawkiorder', reqObj).toPromise();
  }

  async getChawkiOrderById(id) {
    return this.httpClient.get(this.chawki_api + '/chawkiorder/' + id + '?projection=chawkiOrderProjection').toPromise();
  }

  async updateChawkiOrder(reqObj, id) {
    return this.httpClient.patch(this.chawki_api + '/chawkiorder/' + id, reqObj).toPromise()
  }


  async getChawkiOrders(paymentStaus, orderStatus) {
    return this.httpClient.get(this.api + '/chawkiorder/search/statusin?orderstatus=' + orderStatus + '&paymentstatus=' + paymentStaus + '&sort=createdDate,desc').toPromise()
  }

  async getAllApprovedChawki() {
    return this.httpClient.get(this.api + '/chawki/search/isapproved?status=true').toPromise()
  }
  async getAllCustomerTypes() {
    return this.httpClient.get(this.api + '/kyccustomer').toPromise()
  }

  async getAllMudraCustomerTypes() {
    return this.httpClient.get(this.api + '/mudracustomersvc/enums/business/types').toPromise()
  }


  async getAllDocumentsListByCustomerTypes(id, type) {
    return this.httpClient.get(this.api + `/kyc/documents/${id}/${type}`).toPromise()
  }

  async getAllDocumentsListByCustomerTypesMudra(id, type) {
    return this.httpClient.get(this.api + `/mudracustomersvc/kyc/documents/${id}/${type}`).toPromise()
  }

  async getKYCDocumentByID(id) {
    return this.httpClient.get(this.api + `/mudracustomersvc/customerkyc/${id}`).toPromise()
  }

  async uploadChawkiDocImages(nurseryAreaPhotoImgFile, crcFiles, chawkiImageFile, nurseryAreaPhotoImgUploaded, crcImageUploaded, chawkiImageUploaded, id) {

    let formData: FormData = new FormData();
    if (nurseryAreaPhotoImgUploaded) {
      formData.append('nurseryAreaPhotoFile', nurseryAreaPhotoImgFile);
    }
    if (crcImageUploaded) {
      for (const file in crcFiles) {
        formData.append('crcFiles', crcFiles[file]);
      }
    }

    if (chawkiImageUploaded) {
      for (const file in chawkiImageFile) {
        formData.append('chawkiImages', chawkiImageFile[file]);
      }
    }
    formData.append('chawkiIdVal', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.patch(this.api + '/chawkiimage/', formData, options).toPromise();
  }

  getChawkiOrdersForAChawki(chawkiId) {
    return this.httpClient.get(this.api + '/chawki/' + chawkiId + '/chawkiorders/?sort=createdDate,desc').toPromise()
  }

  getChawkiOrdersForAFarmer(farmerId) {
    return this.httpClient.get(this.api + '/farmer/' + farmerId + '/chawkiorders/?sort=createdDate,desc').toPromise()
  }

  getChawkiPaymentAnalytics() {
    return this.httpClient.get(this.api + '/analytics/chawki/newpaymentactivity').toPromise()
  }

  getChawkiTotalsAnalytics(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/chawki/newtotals?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getChawkiOrderAnalytics(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/chawki/newtotalbydate?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getChawkiPmtMethodAnalytics(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/chawki/newpaymentmodeinfo?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getChawkiPmtStatusAnalytics(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/chawki/newpaymentstatusinfo?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getChawkiAnalyticsByOrderStatus(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/chawki/neworderstatusinfo?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getChawkiAnalyticsTopChawkiOrders(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/chawki/neworderbydate?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getChawkiAnalyticsTopSoldItems(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/chawki/marketplaceinfo?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  getFollowupsAnalyticsTotal(customerType = false) {
    const url = customerType ? `${this.api}/analytics/followup/counts?customerType=${customerType}` : `${this.api}/analytics/followup/counts`
    return this.httpClient.get(url).toPromise()
  }

  getFollowupsAnalyticsPendingByCenter(fromDate, toDate, customerType = false) {
    const url = customerType ? `${this.api}/analytics/followup/pendingcenterleads?fromDate=${fromDate}&toDate=${toDate}&customerType=${customerType}` : `${this.api}/analytics/followup/pendingcenterleads?fromDate=${fromDate}&toDate=${toDate}`
    return this.httpClient.get(url).toPromise()
  }

  getFollowupsAnalyticsPendingByUser(fromDate, toDate, customerType = false) {
    const url = customerType ? `${this.api}/analytics/followup/pendinguserleads?fromDate=${fromDate}&toDate=${toDate}&customerType=${customerType}` : `${this.api}/analytics/followup/pendinguserleads?fromDate=${fromDate}&toDate=${toDate}`;
    return this.httpClient.get(url).toPromise();
  }

  getFollowupsAnalyticsByStatus(fromDate, toDate, customerType = false) {
    const url = customerType ? `${this.api}/analytics/followup/countbystatus?status=Active&fromDate=${fromDate}&toDate=${toDate}&customerType=${customerType}` : `${this.api}/analytics/followup/countbystatus?status=Active&fromDate=${fromDate}&toDate=${toDate}`;
    return this.httpClient.get(url).toPromise()
  }

  createChawkiBatch(reqObj) {
    return this.httpClient.post(this.chawki_api + '/chawkibatch', reqObj).toPromise()
  }

  getBatchForAChawki(chawkiId) {
    return this.httpClient.get(this.api + '/chawki/' + chawkiId + '/chawkibatches?sort=createdDate,desc').toPromise()
  }

  getLatestBatchForAChawki(chawkiId) {
    return this.httpClient.get(this.api + '/chawkibatch/search/latestbatch?id=' + chawkiId + '&sort=availableOn,desc').toPromise()
  }


  deleteBatchForChawki(batchId) {
    return this.httpClient.delete(this.chawki_api + '/chawkibatch/' + batchId).toPromise()
  }

  deleteCoupon(couponCode, customerId) {
    return this.httpClient.delete(this.api + '/coupon/deletecoupon/' + couponCode + '/' + customerId).toPromise()
  }

  getCouponUsers(couponId) {
    return this.httpClient.get(this.api + '/promotionalcoupon/' + couponId + '/promotionalcouponusage').toPromise()
  }

  // QB API START

  commonTokenFunct() {
    const headers = new HttpHeaders()

      .set('api-type', 'qb')
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    const reqObj = {
      clientID: "ADRS134OP",
      clientSecret: "MN1WP891QE"
    }
    return this.httpClient.post(this.qbApi + '/public/v1/partner/generateToken', reqObj, { 'headers': headers }).toPromise()
  }
  async getThresholds() {
    return this.httpClient.get(this.api + '/iot/thresholds').toPromise();
  }
  async patchThresholds(payload, deviceId) {
    return this.httpClient.patch(`${this.api}/iot/thresholds/${deviceId}`, payload).toPromise();
  }
  async getAvailableDevice() {
    return this.httpClient.get<any[]>(`${this.api}/iot/farmer/device/available`).toPromise();
  }
  async getInstarstages() {
    return this.httpClient.get(`${this.api}/iot/thresholds/instarstages`).toPromise();
  }

  async thresholdSettings(data) {
    return this.httpClient.post(this.api + '/iot/thresholds', data).toPromise();
  }
  async getAssociatedDeviceById(id) {
    return this.httpClient.get(`${this.api}/iot/deviceAssociation/${id}`).toPromise();
  }
  async getAssociatedDeviceByFarmId(id) {
    return this.httpClient.get(`${this.api}/iot/farmer/device/all?farmer=${id}`).toPromise();
  }
  async updateAssociatedDeviceById(payload, id) {
    return this.httpClient.patch(`${this.api}/iot/deviceAssociation/${id}`, payload).toPromise();
  }
  async deleteDevice(id) {
    return this.httpClient.delete(`${this.api}/iot/thresholds/${id}`).toPromise();
  }
  async deleteDeviceAssociation(id) {
    return this.httpClient.delete(`${this.api}/iot/deviceAssociation/${id}`).toPromise();
  }

  async getAllIotDevices() {
    return this.httpClient.get<AllDevices>(this.api + '/iot/farmer/device/available').toPromise();
  }
  async getAllDeviceAssociations() {
    return this.httpClient.get(this.api + '/iot/deviceAssociation?size=250&sort=createdDate,desc').toPromise();
  }
  async getLiveBids(bidId) {
    return this.httpClient.get(this.api + '/cocoonbidsvc/bids/winners/live/' + bidId).toPromise();
  }
  async getWinnersOfBid(bidId) {
    return this.httpClient.post(this.api + '/cocoonbidsvc/bids/winners/bid/' + bidId, {}).toPromise();
  }
  async getBidDetails(bidId) {
    return this.httpClient.get(this.api + '/cocoonbidsvc/bidding/' + bidId, {}).toPromise();
  }
  async endLiveBid(bidId) {
    return this.httpClient.patch(this.api + '/cocoonbidsvc/bids/stop/' + bidId, {}).toPromise();
  }

  async deviceAssociations(body) {
    return this.httpClient.post(this.api + '/iot/deviceAssociation', body).toPromise();
  }

  async iotDevicePayment(body) {
    return this.httpClient.post(this.api + '/rearingshediotaccount', body).toPromise();
  }

  async getIotDevicePayment(deviceId) {
    return this.httpClient.get(this.api + '/rearingshediotaccount/search/device?device=' + deviceId).toPromise();
  }

  async getIotDevicePaymentDetailsForCustomer(customerId, customerType) {
    return this.httpClient.get(`${this.api}/search/iotaccount/spec?search=(customerId==${customerId} and customerType ==${customerType})&page=0&size=10&sort=createdDate,desc`).toPromise();
  }

  async getIotDevicePaymentHistory(iotAccountId) {
    return this.httpClient.get(this.api + `/search/iotpayment/spec?search=(iotAccount.deviceId==${iotAccountId})&page=0&size=10&sort=createdDate,desc`, iotAccountId).toPromise();
  }

  async saveIotDevicePayment(body) {
    return this.httpClient.post(this.api + '/rearingshediotpayment', body).toPromise();
  }

  async getLatestSensorsData(id, farmerId) {
    return this.httpClient.get(this.api + '/iot/farmer/device/latestreading?farmer=' + farmerId + '&deviceId=' + id).toPromise();
  }
  async getAttributesData(id, farmerId) {
    return this.httpClient.get(this.api + '/iot/farmer/device/attributes?farmer=' + farmerId + '&deviceId=' + id).toPromise();
  }
  async getAlertsData(id) {
    return this.httpClient.get(this.api + '/iot/deviceAlerts/search/openAlerts?deviceId=' + id + '&open=true&sort=createdDate,desc').toPromise();
  }

  async setThresholds(body) {
    const headers = new HttpHeaders()
      .set('api-type', 'qb')
      .set('content-type', 'application/json')
    //.set('Access-Control-Allow-Origin', '*');
    return this.httpClient.post(this.api + '/iot/thresholds', body).toPromise();
  }

  getAllOnlineStores() {
    const reqObj = {
      thirdPartyChainID: environment.qbThirdPartyChainID,
      chainID: environment.qbChainID
    }
    return this.httpClient.post(this.qbApi + '/public/v1/thirdParty/getAllOnlineStores', reqObj).toPromise()
  }

  getAllOnlienProductForAStore(storeId) {
    let reqObj = {
      thirdPartyChainID: environment.qbThirdPartyChainID,
      chainID: environment.qbChainID,
      storeId: storeId
    }
    return this.httpClient.post(this.qbApi + '/public/v1/thirdParty/getAllOnlineProducts', reqObj).toPromise()
  }


  getAllOnlineStoresRMBackend(body) {
    return this.httpClient.post<OnlineStore>(this.api + '/queuebuster/onlinestores', body).toPromise();
  }
  getAllOnlineProductsRMBackend(body) {
    return this.httpClient.post<OnlineProduct>(this.api + '/queuebuster/onlineproducts', body).toPromise();
  }
  getAllStoreSalesInvoicesRMBackend(body) {
    return this.httpClient.post<Invoice>(this.api + '/queuebuster/storesalesinvoice', body).toPromise();
  }

  // Inventory, SKU

  getAllTypes() {
    return this.httpClient.get(this.api + '/type?sort=name,asc').toPromise()
  }

  getAllCategories() {
    return this.httpClient.get(this.api + '/category?sort=name,asc').toPromise()
  }

  getAllTags() {
    return this.httpClient.get(this.api + '/tag?sort=name,asc').toPromise()
  }

  getAllWarehouse() {
    return this.httpClient.get(this.api + '/warehouse?sort=name,asc').toPromise()
  }
  getAllWarehouseQRCode(whId) {
    return this.httpClient.get(this.api + '/qrcode/warehouse/' + whId, { responseType: 'arraybuffer' })
  }

  craeteSKU(reqObj) {
    return this.httpClient.post(this.api + '/sku', reqObj).toPromise()
  }

  getAllSkuList(status) {
    if (status) {
      return this.httpClient.get(this.api + '/sku/search/status?status=' + status + '&sort=createdDate,desc').toPromise()
    } else {
      return this.httpClient.get(this.api + '/sku').toPromise()
    }
  }

  getAllSKUPaginated(page, size, sort, direction, searchQuery) {
    return this.httpClient.get(this.api + '/search/sku/spec?search=' + searchQuery + '&page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction).toPromise();
  }

  deleteSku(id) {
    return this.httpClient.delete(this.api + '/sku/' + id).toPromise()
  }
  getGSTById(id) {
    return this.httpClient.get(this.api + '/gstdetails/' + id).toPromise()
  }
  getWHLayoutById(id) {
    return this.httpClient.get(this.api + '/cocoonbidsvc/warehouselayout/' + id).toPromise()
  }

  getSkuById(id) {
    return this.httpClient.get(this.api + '/sku/' + id).toPromise()
  }

  getYarnTwistingDetailsById(id) {
    return this.httpClient.get(this.yarnLotAPI + '/yarntwisting/' + id).toPromise()
  }

  updateSKU(reqObj, skuId) {
    return this.httpClient.patch(this.api + '/sku/' + skuId, reqObj).toPromise()
  }

  async uploadSkuImage(file, id) {
    let formData: FormData = new FormData();
    formData.append('multipartFiles', file);
    formData.append('id', id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };
    return this.httpClient.post(this.api + '/skuimages', formData, options).subscribe(data => {
    });
  }

  getS3Url(extension, endPoint: string = "sku") {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/${endPoint}?extension=.${extension}`).toPromise()
  }

  getSkuBatchRecieptUrl(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/skubatch_receipts?extension=.${extension}&id=${id}`).toPromise()
  }

  getCatS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/category?extension=.${extension}`).toPromise()
  }
  getS3YarnInLogistics(extension) {
    // yarn_in_logistics
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/sku?extension=.${extension}`).toPromise()
  }
  getTypeS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/type?extension=.${extension}`).toPromise()
  }
  getSalesOrder_BillsS3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/salesorder_bills?extension=.${extension}&id=${id}`).toPromise()
  }
  getCRCBillS3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/chawki_order?extension=.${extension}&id=${id}`).toPromise()
  }


  getS3PresignedUrl(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/type?extension=.${extension}`).toPromise();
  }

  getYarnSalesOrder_BillsS3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/yarnOrder?extension=.${extension}&id=${id}`).toPromise()
  }

  getCocoonLotLogistics_BiilsS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/cocoonorder_logistics?extension=.${extension}`).toPromise()
  }
  getPnLS3Url(extension, supplierId) {
    return this.httpClient.put(`${this.api}/mudracustomersvc/assets/protected/los_pnldoc?extension=.${extension}&id=${supplierId}`, {}).toPromise()
  }
  uploadDataOutput(params) {
    return this.httpClient.post(`${this.api}/mudracustomersvc/cam/add/dataoutput`, params).toPromise()
  }
  pnlS3Url(url) {
    return this.httpClient.put(url, {}).toPromise()
  }

  getYarnLotLogistics_EWayS3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/yarn_lot_logistics_eway?extension=.${extension}&id=${id}`).toPromise()
  }

  getYarnLotLogistics_ImagesS3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/yarn_lot_logistics_images?extension=.${extension}&id=${id}`).toPromise()
  }

  getYarnLot_ReceivedAtCW_POD_S3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/yarn_lot_cw_pod?extension=.${extension}&id=${id}`).toPromise()
  }

  getYarnLot_ReceivedAtCW_Invoice_S3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/yarn_lot_cw_inv?extension=.${extension}&id=${id}`).toPromise()
  }

  getYarnLot_QC_S3Url(extension, id) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/yarn_lot_qc?extension=.${extension}&id=${id}`).toPromise()
  }



  getSKUBatchImageS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/skubatch_upload?extension=.${extension}`).toPromise()
  }

  getCocoonOrder_BiilsS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/cocoonorder_bills?extension=.${extension}`).toPromise()
  }

  rendittagradingS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/rendittagrading?extension=.${extension}`).toPromise()
  }
  
  tpiReportS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/yarn_twisting_qc?extension=.${extension}`).toPromise()
  }

  invoiceFinancingS3Url(extension, supplierId) {
    return this.httpClient.put(`${this.api}/mudracustomersvc/assets/protected/invoice_financing?extension=.${extension}&id=${supplierId}`, {}).toPromise()
  }

  getRendittaGrading(reqObj) {
    return this.httpClient.post(this.api + '/renditta', reqObj).toPromise();
  }

  updateRendittaWithCocoonLot(reqObj, id) {
    return this.httpClient.patch(this.api + '/renditta/' + id, reqObj).toPromise();
  }


  createInvoiceFinancingTranche(params) {
    return this.httpClient.post(`${this.api}/creditlinesvc/creditline/invoice/financing`, params).toPromise();
  }
  updateImageToS3Directly(s3url, file: any) {
    const headers = new HttpHeaders()
      .set('api-type', 'qb')
    // .set('content-type', 'application/json')
    let response = this.httpClient.put(`${s3url}`, file, { 'headers': headers }).toPromise()
    console.log(response);
    return response;
  }

  updateReceiptOnRm(batchId, reqObj) {
    return this.httpClient.patch(this.api + '/skubatch/' + batchId + '/receipts', reqObj).toPromise()
  }

  uploadSkuBatchWithSku(reqObj) {
    return this.httpClient.post(this.api + '/upload/sku', reqObj).toPromise()
  }

  createCategories(body) {
    return this.httpClient.post(this.api + '/category', body).toPromise()
  }
  deleteCategories(id) {
    return this.httpClient.delete(`${this.api}/category/${id}`).toPromise()
  }
  updateCategories(categoryId, body) {
    return this.httpClient.patch(`${this.api}/category/${categoryId}`, body).toPromise()
  }
  createTag(body) {
    return this.httpClient.post(this.api + '/tag', body).toPromise()
  }
  deleteTag(id) {
    return this.httpClient.delete(`${this.api}/tag/${id}`).toPromise()
  }
  updateTag(tagId, body) {
    return this.httpClient.patch(`${this.api}/tag/${tagId}`, body).toPromise()
  }
  createType(body) {
    return this.httpClient.post(this.api + '/type', body).toPromise()
  }
  deleteType(id) {
    return this.httpClient.delete(`${this.api}/type/${id}`).toPromise()
  }
  updateType(typeId, body) {
    return this.httpClient.patch(`${this.api}/type/${typeId}`, body).toPromise()
  }

  async createSKUBatch(reqObj) {
    return this.httpClient.post(this.api + '/skubatch', reqObj).toPromise()
  }

  getAllSkuBatches(status) {
    if (status) {
      return this.httpClient.get(this.api + '/skubatch/search/paymentstatus?status=' + status + '&sort=createdDate,desc').toPromise()
    } else {
      return this.httpClient.get(this.api + '/skubatch').toPromise()
    }
  }

  getSkuBatchById(id) {
    return this.httpClient.get(this.api + '/skubatch/' + id).toPromise()
  }
  getWeaverReturnOrderById(id) {
    return this.httpClient.get(this.api + '/weaverreturnorder/' + id).toPromise()
  }

  weaverPayout(reqObj) {
    return this.httpClient.post(this.api + '/weaverpayout/', reqObj).toPromise()
  }

  weaverPayoutPatch(id: number, reqObj) {
    return this.httpClient.patch(this.api + '/weaverpayout/' + id, reqObj).toPromise()
  }

  weaverKhata(id) {
    return this.httpClient.get(this.api + '/skubatch/' + id + '/weaverpayout/').toPromise()
  }

  getSkuForBatch(id) {
    return this.httpClient.get(this.api + '/skubatch/' + id + '/sku/?sort=name,asc').toPromise()
  }

  getBatchById(id) {
    return this.httpClient.get(this.api + '/skubatch/' + id).toPromise()
  }

  updateSkuBatch(id, reqObj) {
    return this.httpClient.patch(this.api + '/skubatch/' + id, reqObj).toPromise()
  }

  createSampleSkuBatch(reqObj) {
    return this.httpClient.post(this.api + '/skubatch/sample', reqObj).toPromise()
  }

  deleteSkuBatch(id) {
    return this.httpClient.delete(this.api + '/skubatch/' + id).toPromise()
  }

  updateSkuOrder(reqObj, id) {
    return this.httpClient.patch(this.api + '/salesorder/' + id, reqObj).toPromise()
  }

  updateYarnSalesOrder(reqObj, id) {
    return this.httpClient.patch(this.api + '/yarnorder/' + id, reqObj).toPromise()
  }
  stagingEntities(reqObj) {
    return this.httpClient.post(this.api + '/stagingentities', reqObj).toPromise()
  }


  getOrdersForSKU(id) {
    return this.httpClient.get(`${this.api}/salesorder/search/ordersforsku?skuid=${id}` + '&sort=createdDate,desc').toPromise()
  }

  getAnalyticsOfRetailerOrder() {
    return this.httpClient.get(this.api + '/analytics/retailer/salesordercount').toPromise()
  }

  getAnalyticsOfRetailerOrderData() {
    return this.httpClient.get(this.api + '/analytics/retailer/orderdetails?orderStatus=New,Processing,Shipped,Received,Completed').toPromise()
  }

  getRetailersPmtStatusAnalytics(fromDate, toDate) {
    return this.httpClient.get(this.api + '/analytics/retailer/paymentdetails?fromDate=' + fromDate + '&toDate=' + toDate).toPromise()
  }

  async getWeaverAnalyticsData() {
    return this.httpClient.get(this.api + '/analytics/weaver/totalcounts').toPromise();
  }

  async getWeaverSKUAnalyticsData() {
    return this.httpClient.get(this.api + '/analytics/weaver/skubatches').toPromise();
  }

  getAllCategoriesTagsTypes(fromDate, toDate, type) {
    return this.httpClient.get(this.api + '/report/bytype?type=' + type + '&fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise()
  }

  getPOofRetailer(retailerId) {
    let poStatus = ['New', 'Processing']
    return this.httpClient.get(this.api + '/retailerpurchaseorder/search/postatus?poStatus=' + poStatus + '&retailerId=' + retailerId).toPromise();
  }

  getPOAssociatedToOrder(salesOrderId) {
    return this.httpClient.get(this.api + '/salesorder/' + salesOrderId + '/retailerPurchaseOrder').toPromise();
  }

  getSalesOrderReturnAssociatedToSalesOrder(salesOrderId) {
    return this.httpClient.get(this.api + '/salesorder/' + salesOrderId + '/returns').toPromise();
  }

  getSalesOrderForPO(poId) {
    return this.httpClient.get(this.api + '/retailerpurchaseorder/' + poId + '/salesorder').toPromise();
  }

  getAllFollowupsReports(fromDate, toDate) {
    return this.httpClient.get(this.api + '/report/followups?fromDate=' + fromDate + '&toDate=' + toDate, { responseType: 'arraybuffer' }).toPromise()
  }

  generateSKUBarcode(list) {
    return this.httpClient.post(this.api + '/report/sku/barcodes', list, { responseType: 'arraybuffer' }).toPromise()
  }

  generateYarnBarcode(list) {
    return this.httpClient.post(this.yarnLotAPI + '/yarn/procurement/printbagbarcode', list, { responseType: 'arraybuffer' }).toPromise()
  }

  getYarnTwisting(id) {
    return this.httpClient.get(`${this.api}/yarnlisting/${id}/yarntwisting`).toPromise();
  }

  createYarnTwistingUnit(payload) {
    return this.httpClient.post(`${this.api}/yarntwistingunit`, payload).toPromise();
  }
  patchYarnTwistingUnit(payload, id) {
    return this.httpClient.patch(`${this.api}/yarntwistingunit/${id}`, payload).toPromise();
  }

  getYarnTwistingById(id) {
    return this.httpClient.get(this.api + '/yarntwistingunit/' + id).toPromise();
  }

  makePaymentForTwistingUnit(reqObj) {
    return this.httpClient.post(this.api + '/twistingunitpo', reqObj).toPromise();
  }

  getYarnListingForYarnTwistingUnit(id) {
    return this.httpClient.get(`${this.api}/yarntwistingunit/${id}/yarntwisting`).toPromise();
  }

  getYarnListEstimateTotal(reqObj) {
    return this.httpClient.post(this.api + '/estimate/yarnorder', reqObj).toPromise();
  }

  getCocoonListEstimateTotal(reqObj) {
    return this.httpClient.post(this.SILK_API + '/estimate/cocoonorder', reqObj).toPromise();
  }

  getReturnRetailerSalesOrderById(id) {
    return this.httpClient.get(`${this.api}/retailersalesreturn/${id}`).toPromise();
  }

  async updateReturnSalesOrder(id, payload) {
    return this.httpClient.patch(`${this.api}/retailersalesreturn/${id} `, payload).toPromise();
  }
  async createFarmerKYC(payload, customer) {
    return this.httpClient.post(`${this.api}/${customer}kyc`, payload).toPromise();
  }

  async createMudraKYCDocs(payload) {
    return this.httpClient.post(`${this.api}/mudracustomersvc/customerkyc`, payload).toPromise();
  }

  async updateFarmerKYC(payload, id, customer) {
    return this.httpClient.patch(`${this.api}/${customer}kyc/${id}`, payload).toPromise();
  }

  async updateMudraKYCDocs(id, payload) {
    return this.httpClient.patch(`${this.api}/mudracustomersvc/customerkyc/${id}`, payload).toPromise();
  }

  async getAllFarmerKycDocList(farmarId, customer) {
    return this.httpClient.get(`${this.api}/${customer}/${farmarId}/kycaudits`).toPromise();
  }
  async saveTCS(payload) {
    return this.httpClient.post(`${this.api}/retailer/financialtransaction`, payload).toPromise();

  }

  async getAllMudraCustomerKycDocList(farmarId) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/customerkyc/search/findByCustomer_id?customerid=${farmarId}`).toPromise();
  }

  async getAllMudraLeadKycDocList(farmarId) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/customerkyc/search/findByLeadProfileId?leadProfileId=${farmarId}`).toPromise();
  }

  async verifyKYC(payload, farmarId, customer) {
    return this.httpClient.put(`${this.api}/kyc/${customer}/${farmarId}/verify`, payload).toPromise();
  }

  async verifyKYCLeadDocs(docId, customer) {
    return this.httpClient.get(`${this.api}/mudrakycsvc/kyc/verify/${customer}/${docId}`).toPromise();
  }


  async updateReport(leadId, leadProfileId) {
    return this.httpClient.post(`${this.api}/precisasvc/report?leadId=${leadId}&leadProfileId=${leadProfileId}`, {}).toPromise();
  }

  //KYC S3 API

  async getKYCPresignedUrl(customerType: String, extension, customerId: Number, proofs: String) {
    return this.httpClient.put(`${this.api}/assets/protected/${customerType}?extension=.${extension}&id=${customerId}&folder=${proofs}`, {}).toPromise();
  }
  async getKYCPresignedUrlMudra(extension, customerId: Number) {
    return this.httpClient.put(`${this.api}/mudracustomersvc/assets/protected/kyc_docs?extension=.${extension}&id=${customerId}`, {}).toPromise();
  }
  // /assets/protected/kyc_docs?extension=.png&id=400055

  getPresignedUrlForViewImage(url: string) {
    return this.httpClient.get(`${this.api}/assets/protected/?url=${url}`).toPromise();
  }
  getMudraPresignedUrlForViewImage(url: string) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/assets/protected/?url=${url}`).toPromise();
  }

  getPresignedUrlForViewImageMUdra(url: string) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/assets/protected/?url=${url}`).toPromise();
  }

  stagingentitie(endPoint: String, payload: any) {
    return this.httpClient.post(`${this.api}/${endPoint}`, payload)
  }

  updateStatetransitions(id: any, payload: any) {
    return this.httpClient.patch(`${this.api}/statetransitions/${id}`, payload);
  }

  updateStatetransitionsQuestion(satateTransitionId: number, payload) {
    return this.httpClient.post(`${this.api}/statetransitions/${satateTransitionId}/validate`, payload)
  }

  getStateTransitions(id: number, processType: String) {
    return this.httpClient.get(`${this.api}/statetransitions?entityId=${id}&processType=${processType}`);
  }

  validateForerrors(satateTransitionId: number, payload: any = {}) {
    return this.httpClient.post(`${this.api}/statetransitions/${satateTransitionId}/validate`, payload)
  }

  getStagingentities(entityId: number, processType: String) {
    return this.httpClient.get(`${this.api}/stagingentities/search/findByEntityIdAndProcessType?entityId=${entityId}&processType=${processType}`)
  }

  getAllStateDefinition() {
    return this.httpClient.get(`${this.api}/enums/statedefinition/action`);
  }

  getAssignedToUsersForTransition(satateTransitionId: number) {
    return this.httpClient.get(`${this.api}/statetransitions/${satateTransitionId}/users`)
  }
  getAssignedToUsersForTrans(satateTransitionId: number) {
    return this.httpClient.get(`${this.api}/statetransitions/${satateTransitionId}/users`).toPromise();
  }

  getStatTransitionsProgress(entityId: number, processType) {
    return this.httpClient.get(`${this.api}/statetransitions/progress?entityId=${entityId}&processType=${processType}`).toPromise();
  }
  getCamundaStatTransitionsProgress(entityId: number) {
    return this.httpClient.get(`${this.api}/skubatch/progress?entityId=${entityId}&status=Approved`).toPromise();
  }


  getStatTransitionsTimeline(entityId: number, processType) {
    return this.httpClient.get(`${this.api}/search/statetransitions/timeline/spec?search=(processType==${processType} and entityId==${entityId})&size=200&sort=approvedAt,desc`).toPromise();
  }
  getCamundaStatTransitionsTimeline(entityId: number) {
    return this.httpClient.get(`${this.api}/skubatch/timeline?entityId=${entityId}`).toPromise();
  }
  getCamundaStatTransitionsTimelineSO(entityId: number) {
    return this.httpClient.get(`${this.api}/salesorder/${entityId}/timeline`).toPromise();
  }
  getCamundaStatTransitionsTimelineSOReturn(entityId: number) {
    return this.httpClient.get(`${this.api}/salesorderreturn/${entityId}/timeline`).toPromise();
  }
  getCamundaStatTransitionsTimelineYarnSO(entityId: number) {
    return this.httpClient.get(`${this.api}/yarnorder/${entityId}/timeline`).toPromise();
  }

  getStatTransitionsTimelineViewAnswer(entityId: number, processType) {
    return this.httpClient.get(`${this.api}/search/statetransitions/timeline/spec?search=(processType==${processType} and entityId==${entityId})&size=200&sort=approvedAt,desc`).toPromise();
  }

  getStateDefinition(satateTransitionId: number) {
    return this.httpClient.get(`${this.api}/statedefinition/${satateTransitionId}`).toPromise();
  }

  checkIfAuthorized(entityId, processType) {
    return this.httpClient.get(`${this.api}/skubatch/authorize?entityId=${entityId}&processType=${processType}`)
  }

  updateStagingentities(entityId, reqObj) {
    return this.httpClient.patch(`${this.api}/stagingentities/${entityId}`, reqObj);
  }

  getDetailsFromEmbadedUrl(url) {
    let modifiedUrl = url.replace('http:', 'https:');
    return this.httpClient.get(modifiedUrl).toPromise();
  }
  generateGrnSkuBatch(entityId: number) {
    return this.httpClient.post(`${this.api}/skubatch/${entityId}/grn`, {}).toPromise();
  }
  downloadSKUBatchSKUs(batchId) {
    return this.httpClient.get(`${this.api}/report/skubatchskus/${batchId}`, { responseType: 'arraybuffer' }).toPromise();

  }
  getRendittaGradingById(id) {
    return this.httpClient.get(`${this.api}/rendittagrading/${id}`).toPromise();
  }

  deleteRendittaGradingById(id) {
    return this.httpClient.delete(`${this.api}/rendittagrading/${id}`).toPromise();
  }

  addAdvisories(payload) {
    return this.httpClient.post(`${this.api}/iot/advisories`, payload).toPromise();
  }

  createTableLayout(payload) {
    return this.httpClient.post(`${this.api}/cocoonbidsvc/tablelayout`, payload).toPromise();
  }
  updateTableLayout(id, payload) {
    return this.httpClient.patch(`${this.api}/cocoonbidsvc/tablelayout/${id}`, payload).toPromise();
  }
  getTableLayoutById(id) {
    return this.httpClient.get(`${this.api}/cocoonbidsvc/tablelayout/${id}`).toPromise();
  }

  splitCocoonLot(id: number, payload) {
    return this.httpClient.post(`${this.SILK_API}/cocoon/lots/warehouse/${id}`, payload).toPromise();
  }

  getCocoonLotDetailsBidding(warehouseId: number, bidId) {
    return this.httpClient.get(`${this.api}/cocoonbidsvc/rmbids/cocoonlot/${warehouseId}/${bidId}`).toPromise();
  }

  attachLotsToBid(bidId: string, entityId: number, add: boolean = false) {
    return this.httpClient.post(`${this.api}/cocoonbidsvc/rmbids/lots/${bidId}/${entityId}?add=${add}`, {}).toPromise();
  }

  getAllLotsByBidId(bidId: string) {
    return this.httpClient.get(`${this.api}/cocoonbidsvc/rmbids/lots/${bidId}`).toPromise();
  }
  // {{bid-service-url}}/rmbids/cocoonlot/400002/61d171dfa6bf5b1d3fa3df84
  validateLotIds(lotList = []) {
    return this.httpClient.post(`${this.api}/cocoonbidsvc/rmbids/lots/validate`, lotList).toPromise();
  }

  cartCheckout(cartId, itemId) {
    return this.httpClient.post(`${this.api}/cartsvc/cart/${cartId}/checkout/${itemId}`, {}).toPromise();
  }
  setCreditLimitLOS(params) {
    //return this.httpClient.post(`${this.api}/lmsworkflowsvc/workflow/creditlimit/assign/initiate`, params).toPromise();
    return this.httpClient.post(`${this.api}/creditlinesvc/creditlimit`, params).toPromise();
  }
  setCreditLimit(params) {
    return this.httpClient.post(`${this.api}/lmsworkflowsvc/workflow/creditlimit/update/initiate`, params).toPromise();
  }

  //getCustomInterest updated Manjunath B
  getCustomInterest(accountId, loanType) {
    return this.httpClient.get(`${this.api}/creditlinesvc/custom/interest/spec?search=(defaultMode==false and loanProductType==${loanType}) and accountId==${accountId}`).toPromise();
  }
  getCustomFee(accountId) {
    return this.httpClient.get(`${this.api}/creditlinesvc/fee/spec?search=(accountId==${accountId})`).toPromise();
  }
  getCustomFeeLOS(accountId) {
    return this.httpClient.get(`${this.api}/creditlinesvc/feeModel/spec?search=(leadUUID==${accountId})`).toPromise();
  }
  //getdefaultInterest updated Manjunath B
  getdefaultInterest(loanProductType) {
    return this.httpClient.get(`${this.api}/creditlinesvc/custom/interest/spec?search=( defaultMode==true and loanProductType==${loanProductType})`).toPromise();
  }
  getdefaultFee(loanProductType) {
    return this.httpClient.get(`${this.api}/creditlinesvc/fee/spec?search=(defaultMode==true and productType==${loanProductType})`).toPromise();
  }
  getdefaultFeeLOS(loanProductType) {
    return this.httpClient.get(`${this.api}/creditlinesvc/feeModel/spec?search=(defaultMode==true and productType==${loanProductType})`).toPromise();
  }
  //getDepositeType updated Manjunath B
  getDepositeType() {
    return this.httpClient.get(`${this.api}/creditlinesvc/enums/deposit/type?page=0&size=100&sort=name,asc`).toPromise();
  }
  getMudraCustomerTypes() {
    return this.httpClient.get(`${this.api}/creditlinesvc/enums/customer/profiles?page=0&size=100&sort=name,asc`).toPromise();
  }
  getMudraCustomerSource() {
    return this.httpClient.get(`${this.api}/creditlinesvc/enums/customer/source?page=0&size=100&sort=name,asc`).toPromise();
  }
  getCartById(cartId) {
    return this.httpClient.get(`${this.api}/cartsvc/cart/${cartId}`).toPromise();
  }

  getProjectionAPI(endpoint: string, projection: string, customerId: number) {
    return this.httpClient.get(`${this.api}/${endpoint}/${customerId}?projection=${projection}`).toPromise();
  }

  verifyKYCService(customerType: string = 'REELER', customerId: number) {
    return this.httpClient.get(`${this.api}/kycsvc/kyc/verify/${customerType}/${customerId}`).toPromise();
  }
  verifyMudraKYCService(customerType: string = 'REELER', customerId: number) {
    return this.httpClient.get(`${this.api}/mudrakycsvc/kyc/verify/${customerType}/${customerId}`).toPromise();
  }

  isKycVerified(customerType: string = 'REELER', customerId: number) {
    return this.httpClient.get(`${this.api}/kycsvc/kyc/${customerType}/verified/${customerId}`).toPromise();
  }

  verifyKYCResults(kycDocumentId: string) {
    return this.httpClient.get(`${this.api}/kycsvc/kycverificationresult/${kycDocumentId}`).toPromise();
  }
  verifyMudraKYCResults(kycDocumentId: string) {
    return this.httpClient.get(`${this.api}/mudrakycsvc/kycverificationresult/${kycDocumentId}`).toPromise();
  }

  getGSTR(params: string) {
    return this.httpClient.get(`${this.api}/kycsvc/kyc/gst/gstr?${params}`).toPromise();
  }

  getCreditCalculatedAmount(params) {
    return this.httpClient.get(`${this.api}/kycsvc/credit/calculator?${params}`).toPromise();
  }

  getMudraGSTR(params: string) {
    return this.httpClient.get(`${this.api}/mudrakycsvc/kyc/gst/gstr?${params}`).toPromise();
  }

  postGinner(payload: any) {
    return this.httpClient.post(`${this.COTTON_API}/ginner`, payload).toPromise();
  }
  cottonSalesOrderPaymentHistoryByOrderId(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/ginnerpayment/search/cottonorder?cottonorderid=${id}`).toPromise();
  }

  cottonLotPaymentHistoryByOrderId(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/cottonfarmerpayout/search/cottonlot?cottonlotid=${id}`).toPromise();
  }

  pupaeLotPaymentHistoryByOrderId(id: number) {
    return this.httpClient.get(`${this.PUPAE_API}/pupaesupplierpayout/search/pupaelot?pupaelotid=${id}`).toPromise();
  }

  pupaeSalesOrderPaymentHistoryByOrderId(id: number) {
    return this.httpClient.get(`${this.PUPAE_API}/pupaebuyerpayout/search/pupaeorder?pupaeorderid=${id}`).toPromise();
  }

  patchGinner(id: number, payload: any) {
    return this.httpClient.patch(`${this.COTTON_API}/ginner/${id}`, payload).toPromise();
  }

  getGinnerDetailsById(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/ginner/${id}`).toPromise();
  }

  postCottonLot(payload: any) {
    return this.httpClient.post(`${this.COTTON_API}/cottonlot`, payload).toPromise();
  }
  patchCottonLot(id: number, payload: any) {
    return this.httpClient.patch(`${this.COTTON_API}/cottonlot/${id}`, payload).toPromise();
  }
  patchCottonOrder(id: number, payload: any) {
    return this.httpClient.patch(`${this.COTTON_API}/cottonSalesOrder/${id}`, payload).toPromise();
  }

  getCottonLotDetailsById(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/cottonlot/${id}`).toPromise();
  }
  getCottonOrdersById(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/cottonSalesOrder/${id}`).toPromise();
  }


  createRmConfig(config) {
    return this.httpClient.post(`${this.api}/rmconfigs`, config).toPromise();
  }

  updateConfig(id, config) {
    return this.httpClient.patch(`${this.api}/rmconfigs/${id}`, config).toPromise();
  }

  getConfigById(id) {
    return this.httpClient.get(`${this.api}/rmconfigs/${id}`).toPromise();
  }

  getAllHsn() {
    return this.httpClient.get(`${this.hsnApi}/hsncode`).toPromise();
  }
  updateMoreGstNumber(reqObj) {
    return this.httpClient.patch(`${this.COTTON_API}/gstnumber`, reqObj).toPromise();
  }
  getAllHsns(paginationData, search: any = false) {
    const searchQuery = search ? `search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}` : `page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.hsnApi}/products/spec/hsn?${searchQuery}`).toPromise();
  }

  createNewHsnGst(gstForm) {
    return this.httpClient.post(`${this.hsnApi}/gst`, gstForm).toPromise();
  }

  getHsnGstById(id) {
    return this.httpClient.get(`${this.hsnApi}/gst/${id}`).toPromise();
  }

  getAllHsnGst() {
    return this.httpClient.get(`${this.hsnApi}/gst`).toPromise();
  }

  createProduct(reqObj) {
    return this.httpClient.post(`${this.hsnApi}/product`, reqObj).toPromise();
  }

  getRmProductById(productId) {
    return this.httpClient.get(`${this.hsnApi}/product/${productId}`).toPromise();
  }

  updateRmProduct(id, reqObj) {
    return this.httpClient.patch(`${this.hsnApi}/product/${id}`, reqObj).toPromise();
  }

  getAllProductCategories(paginationData, search: any = false) {
    const searchQuery = search ? `search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}` : `page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.hsnApi}/products/spec/category/names?${searchQuery}`).toPromise();

  }

  createProductTag(reqObj) {
    return this.httpClient.post(`${this.hsnApi}/tags`, reqObj).toPromise();
  }

  getAllProductTags(paginationData, search: any = false) {
    const searchQuery = search ? `search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}` : `page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.hsnApi}/products/spec/tags?${searchQuery}`).toPromise();
  }

  createNewHsnCode(reqObj) {
    return this.httpClient.post(`${this.hsnApi}/hsncode`, reqObj).toPromise();
  }

  getProductTagById(tagId) {
    return this.httpClient.get(`${this.hsnApi}/tags/${tagId}`).toPromise();
  }

  updateProductTagById(id, tagsObj) {
    return this.httpClient.patch(`${this.hsnApi}/tags/${id}`, tagsObj).toPromise();
  }

  getTypesByCategory(paginationData, search: any = false) {
    const searchQuery = search ? `search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}` : `page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.hsnApi}/products/spec/category/types?${searchQuery}`).toPromise();
  }

  getAllTagNames(paginationData, search: any = false) {
    const searchQuery = search ? `search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}` : `page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.hsnApi}/products/spec/tags/name?${searchQuery}`).toPromise();
  }

  getSubcategoryByCategoryName(paginationData, search: any = false) {
    const searchQuery = search ? `search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}` : `page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.hsnApi}/products/spec/subcategory/?${searchQuery}`).toPromise();
  }

  getSkuComputedWithGst(skus) {
    return this.httpClient.post(`${this.hsnApi}/products/compute/gst`, skus).toPromise();
  }

  getPupaeOrdersById(id: number) {
    return this.httpClient.get(`${this.PUPAE_API}/pupaesalesorder/${id}`).toPromise();
  }

  getPupaeDetailsById(id) {
    return this.httpClient.get(`${this.PUPAE_API}/pupaelisting/${id}`).toPromise();
  }

  // logistics partners API's

  patchingcocoonlotlogisticsstatus(id: number, payload) {
    return this.httpClient.patch(`${this.logistic_api}/shipment/${id}`, payload).toPromise();
  }

  createLogisticsCompany(reqObj) {
    return this.httpClient.post(`${this.logistic_api}/logistics/company`, reqObj).toPromise();
  }
  patchLogistics(id: number, reqObj) {
    return this.httpClient.post(`${this.logistic_api}/logistics/company/${id}`, reqObj).toPromise();
  }
  updateLogisticsCompany(id: number, reqObj) {
    return this.httpClient.patch(`${this.logistic_api}/company/${id}`, reqObj).toPromise();
  }
  updateBlacklistLogisticsCompany(id: number, reqObj) {
    return this.httpClient.post(`${this.logistic_api}/logistics/company/${id}/blacklist`, reqObj).toPromise();
  }
  createLogisticsCompanyDriver(reqObj) {
    return this.httpClient.post(`${this.logistic_api}/driver`, reqObj).toPromise();
  }
  updateLogisticsCompanyDriver(id: number, reqObj) {
    return this.httpClient.patch(`${this.logistic_api}/driver/${id}`, reqObj).toPromise();
  }
  createLogisticsCompanyVehicle(reqObj) {
    return this.httpClient.post(`${this.logistic_api}/vehicles`, reqObj).toPromise();
  }
  getLogisticsDetailsById(id: number) {
    return this.httpClient.get(`${this.logistic_api}/company/${id}`).toPromise();
  }
  getLogisticsDriverById(id: number) {
    return this.httpClient.get(`${this.logistic_api}/company/${id}/driver`).toPromise();
  }
  getLogisticsVehiclesById(id: number) {
    return this.httpClient.get(`${this.logistic_api}/company/${id}/vehicles`).toPromise();
  }
  createDriversForCompany(id: number, reqObj) {
    return this.httpClient.post(`${this.logistic_api}/logistics/company/${id}`, reqObj).toPromise();
  }
  getSingleDriverById(id: number) {
    return this.httpClient.get(`${this.logistic_api}/driver/${id}`).toPromise();
  }
  updateSingleDriverById(id: number, reqObj) {
    return this.httpClient.patch(`${this.logistic_api}/driver/${id}`, reqObj).toPromise();
  }
  getSingleVehicleById(id: number) {
    return this.httpClient.get(`${this.logistic_api}/vehicles/${id}`).toPromise();
  }
  updateSingleVehicleById(id: number, reqObj) {
    return this.httpClient.patch(`${this.logistic_api}/vehicles/${id}`, reqObj).toPromise();
  }
  getDriverCompanyData(id: number) {
    return this.httpClient.get(`${this.logistic_api}/driver/${id}/company`).toPromise();
  }
  fetchAllDriversList() {
    return this.httpClient.get(`${this.logistic_api}/driver`).toPromise();
  }
  dispatchLogisticOrder(reqObj) {
    return this.httpClient.post(`${this.logistic_api}/cocoonlotlogistics`, reqObj).toPromise();
  }
  generateMudraOtp(reqObj) {
    return this.httpClient.post(`${this.otpApi}/otp/generate`, reqObj).toPromise();
  }
  verifyMudraOtp(reqObj) {
    return this.httpClient.post(`${this.otpApi}/otp/verify`, reqObj).toPromise();
  }

  generateSalesOrderInvoice(reqObj, type) {
    return this.httpClient.put(`${this.api}/invoices/salesorder/${type}`, reqObj).toPromise();
  }

  // device Management API's
  createDeviceType(reqObj) {
    return this.httpClient.post(`${this.deviceManagement_API}/devicetype`, reqObj).toPromise();

  }
  updateDeviceType(id, reqObj) {
    return this.httpClient.patch(`${this.deviceManagement_API}/devicetype/update/${id}`, reqObj).toPromise();
  }
  getALLDeviceTypes() {
    return this.httpClient.get(`${this.deviceManagement_API}/devicetype`).toPromise();
  }
  async searchAllDeviceType() {
    return this.httpClient.get(this.deviceManagement_API + '/devicetype/search/spec?page=0&size=10&sort=createdDate,desc').toPromise();
  }
  getDeviceTypesById(id: number) {
    return this.httpClient.get(`${this.deviceManagement_API}/devicetype/${id}`).toPromise();
  }
  getDeviceDetailessById(id: number) {
    return this.httpClient.get(`${this.deviceManagement_API}/devicetype/${id}/detailed`).toPromise();
  }

  getALLDeviceslist() {
    return this.httpClient.get(`${this.deviceManagement_API}/device`).toPromise();
  }

  createNewDevice(reqObj) {
    return this.httpClient.post(`${this.deviceManagement_API}/device`, reqObj).toPromise();
  }
  updateDevice(id, reqObj) {
    return this.httpClient.patch(`${this.deviceManagement_API}/device/${id}`, reqObj).toPromise();
  }
  updateDeviceData(id, reqObj) {
    return this.httpClient.put(`${this.deviceManagement_API}/device/${id}`, reqObj).toPromise();
  }
  getDeviceDataByID(id: number) {
    return this.httpClient.get(`${this.deviceManagement_API}/device/${id}`).toPromise();

  }
  deviceLocationChange(reqObj) {
    return this.httpClient.patch(`${this.deviceManagement_API}/device/bulk`, reqObj).toPromise();
  }

  deviceAssigneeChange(reqObj) {
    return this.httpClient.patch(`${this.deviceManagement_API}/device/assign`, reqObj).toPromise();

  }
  getDeviceTypeImageS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/device_management_images?extension=.${extension}`).toPromise()
  }
  getDeviceTypeDocsS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/device_management_documents?extension=.${extension}`).toPromise()
  }
  getRearingIotFollowupNoteImageUrl(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/rearingiot_followupnoteimage?extension=.${extension}`).toPromise()
  }
  getDeviceLogs(id, paginationData) {
    return this.httpClient.get(`${this.deviceManagement_API}/devicelog/search/spec?search=(deviceDetail.code==${id})&page=${paginationData.currentPage}&size=10&sort=time,desc`).toPromise()
  }

  getDeviceSalesOrder() {
    return this.httpClient.get(`${this.deviceManagement_API}/devicemanagementsalesorder`).toPromise()
  }
  getDeviceTypeRatePlans() {
    return this.httpClient.get(`${this.deviceManagement_API}/devicetyperateplan`).toPromise()
  }

  createSubscriptionPlan(reqObj) {
    return this.httpClient.post(`${this.deviceManagement_API}/subscriptionplan`, reqObj).toPromise();

  }

  getSubsciptionPlan(id) {
    return this.httpClient.get(`${this.deviceManagement_API}/subscriptionplan/${id}`).toPromise();

  }

  createDeviceSubscription(reqObj) {
    return this.httpClient.post(`${this.deviceManagement_API}/devicesubscription`, reqObj).toPromise();

  }
  patchSubscriptionPlan(id, status) {
    return this.httpClient.post(`${this.deviceManagement_API}/subscriptionplan/activate/${id}?activate=${status}`, '').toPromise();
  }
  subscriptionPayment(reqObj) {
    return this.httpClient.post(`${this.deviceManagement_API}/devicesubscriptionpayment`, reqObj).toPromise();
  }
  cancelSubscription(id, reqobj) {
    return this.httpClient.post(`${this.deviceManagement_API}/devicesubscription/cancel/${id}`, reqobj).toPromise();
  }

  // mulberry IOT service API's
  syncMulberrydata() {
    return this.httpClient.post(`${this.mulberryIotService_API}/sync/`, '').toPromise();
  }
  getDeviceDataByPlotID(plotID) {
    return this.httpClient.get(`${this.mulberryIotService_API}/deviceallocation/getdetails/${plotID}`).toPromise();
  }
  getDeviceDataByDeviceID(deviceID) {
    return this.httpClient.get(`${this.mulberryIotService_API}/deviceallocation/search/findByDeviceCode?deviceCode=${deviceID}`).toPromise();
  }
  patchAgronimistdata(id: number, reqObj) {
    return this.httpClient.patch(`${this.mulberryIotService_API}/deviceallocation/${id}`, reqObj).toPromise();
  }
  getRefreshLiveData(plotID, reqObj) {
    return this.httpClient.post(`${this.mulberryIotService_API}/plot/${plotID}/liveData`, reqObj).toPromise();

  }

  getSensorLatestData(plotID) {
    return this.httpClient.get(`${this.mulberryIotBeaconService_API}/beacon/historydata/${plotID}`).toPromise();
  }


  computingSkuSP(reqObj) {
    return this.httpClient.post(`${this.api}/skubatch/compute/sellingPrice`, reqObj).toPromise();
  }
  updateWeaverReturnOrder(reqObj, id) {
    return this.httpClient.patch(`${this.api}/weaverreturnorder/${id}`, reqObj).toPromise();
  }

  //Cotton Balles
  createSpinningMill(reqObj) {
    return this.httpClient.post(`${this.COTTON_API}/spinningmill`, reqObj).toPromise();
  }
  gstVerificationforSpinningMill(payload) {
    return this.httpClient.post(`${this.COTTON_API}/spinningmill`, payload).toPromise();
  }
  //gst verification for ginner
  gstVerificationforGinner(payload) {
    return this.httpClient.post(`${this.COTTON_API}/ginner`, payload).toPromise();
  }

  //gst verification for oil spinning mill//
  gstVerificationforOilSpinningMill(payload) {
    return this.httpClient.post(`${this.COTTON_API}/oilmill`, payload).toPromise();
  }

  updateSpinningMill(reqObj, id) {
    return this.httpClient.patch(`${this.COTTON_API}/spinningmill/${id}`, reqObj).toPromise();
  }
  // update oil spinning mill detailes//
  updateOilSpinningMill(reqObj, id) {
    return this.httpClient.patch(`${this.COTTON_API}/oilmill/${id}`, reqObj).toPromise();
  }


  getSpinningMillById(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/spinningmill/${id}`).toPromise();
  }
  //oil spinning mill by id
  getOilSpinningMillById(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/oilmill/${id}`).toPromise();
  }

  // bale purchase performa
  searchAllspinMills(page, size, column, direction, params) {
    return this.httpClient.get(this.COTTON_API + '/search/spinningmill/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }
  createBalePerforma(reqObj) {
    return this.httpClient.post(`${this.COTTON_API}/balepurchaseproforma`, reqObj).toPromise();
  }
  getBalePerformaById(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/balepurchaseproforma/${id}`).toPromise();
  }
  patchBalePerformaById(id: number, reqObj) {
    return this.httpClient.patch(`${this.COTTON_API}/balepurchaseproforma/${id}`, reqObj).toPromise();
  }
  getSpinnMillofPerfoma(reqURL) {
    return this.httpClient.get(`${this.COTTON_API}/${reqURL}`).toPromise();

  }
  getBalePOS3Url(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/spinningmill_purchaseorder?extension=.${extension}`).toPromise()
  }
  getbaleSOPresignedUrl(extension) {
    return this.httpClient.get(`${this.api}/assets/preSignedUrl/cottonbale_salesorder?extension=.${extension}`).toPromise()
  }

  updateStateTransition(reqObj, id) {
    return this.httpClient.patch(`${this.api}/statetransitions/${id}`, reqObj).toPromise();
  }

  createBalePurchase(reqObj) {
    return this.httpClient.post(`${this.COTTON_API}/cottonbalelisting`, reqObj).toPromise();
  }
  updateBalePurchase(id: number, reqObj) {
    return this.httpClient.patch(`${this.COTTON_API}/cottonbalelisting/${id}`, reqObj).toPromise();
  }

  getBalePurchaseById(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/cottonbalelisting/${id}`).toPromise();
  }
  getBalesSalesOrderByID(id: number) {
    return this.httpClient.get(`${this.COTTON_API}/cottonbalesalesorder/${id}`).toPromise();
  }

  patchCottonBale(id: number, reqObj) {
    return this.httpClient.patch(`${this.COTTON_API}/cottonbalesalesorder/${id}`, reqObj).toPromise();
  }
  CreateCottoBaleSaleOrder(reqObj) {
    return this.httpClient.post(`${this.COTTON_API}/cottonbalesalesorder`, reqObj).toPromise();
  }
  getSpinningMillPOList(spinId, cottonType) {
    return this.httpClient.get(`${this.COTTON_API}/search/balepurchaseproforma/spec?search=((spinningMill.id==${spinId}) and cottonType=in=(${cottonType}) and status=in=(NEW,PROCESSING))&page=0&size=50`).toPromise();
  }
  getBaleSpinningMills(spinIdURL) {
    return this.httpClient.get(`${this.api}/${spinIdURL}`).toPromise();
  }
  getBalePurchasepayments(baleID) {
    return this.httpClient.get(`${this.COTTON_API}/ginnerpayout/search/cottonbalelisting?cottonbalelistingid=${baleID}`).toPromise();
  }

  getBaleSalespayments(baleSaleID) {
    return this.httpClient.get(`${this.COTTON_API}/spinningmillpayment/search/cottonbalesalesorder?cottonbalesalesorderid=${baleSaleID}`).toPromise();
  }

  getOrderListing(baleListingID) {
    return this.httpClient.get(`${this.COTTON_API}/cottonbalesalesorder/search/orderforlisting?cottonbalelistingid=${baleListingID}&page=0&size=100&sort=createdDate,desc`).toPromise();
  }

  postMudraLeadProfile(payload) {
    return this.httpClient.post(`${this.api}/mudracustomersvc/lead/profile`, payload).toPromise();
  }

  putMudraLeadProfile(payload) {
    return this.httpClient.put(`${this.api}/mudracustomersvc/lead/profile/update`, payload).toPromise();
  }

  getMudraLeadProfile(leadId: number) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/lead/profile/spec?search=(leadId==${leadId})`).toPromise();
  }
  getMudraSuppliersByBank(bankId: number) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/supplier/search/bank/${bankId}`).toPromise();
  }
  getMudraMappedSuppliers(customerId, accountId: number) {
    return this.httpClient.get(`${this.api}/creditlinesvc/customer/affliate/search/supplier/customer/${customerId}/account/${accountId}`).toPromise();
  }
  mapMudraSupplierWithCustomer(params) {
    return this.httpClient.post(`${this.api}/creditlinesvc/customeraffliate`, params).toPromise();
  }
  verifyWeaverInvoice(weaverId, weaverInvoiceNumber, batchId) {
    if (batchId) {
      return this.httpClient.get(`${this.api}/skubatch/isReceiptNumberExists?weaverId=${weaverId}&invoiceNumber=${weaverInvoiceNumber}&batchId=${batchId}`).toPromise();
    } else {
      return this.httpClient.get(`${this.api}/skubatch/isReceiptNumberExists?weaverId=${weaverId}&invoiceNumber=${weaverInvoiceNumber}`).toPromise();
    }
  }


  //validate farmer with otp api's
  apiTemporaryOboardFarmer(reqObj) {
    return this.httpClient.post(`${this.api}/signup`, reqObj).toPromise();
  }

  apiGenerateFarmerOTP(mobile) {
    return this.httpClient.post(`${this.api}/signup/otp/${mobile}`, {}).toPromise();
  }

  apiResendFarmerOTP(mobile) {
    return this.httpClient.post(`${this.api}/userauthsvc/security/otp/resend/${mobile}`, {}).toPromise();
  }

  apiValidateFarmerOTP(reqObj) {
    return this.httpClient.post(`${this.api}/userauthsvc/security/otp/verify`, reqObj).toPromise();
  }

  apiSaveFarmerKyc(reqObj) {
    return this.httpClient.post(`${this.api}/kyc/documentsupload`, reqObj).toPromise();
  }

  apiUpdateFarmerKyc(reqObj) {
    return this.httpClient.patch(`${this.api}/kyc/documentsupload`, reqObj).toPromise();
  }
  async getDriverDetailsFromNumber(number) {
    return this.httpClient.get(`${this.logistic_api}/logistics/driver/spec?search=(isBlackListed==${"false"} and mobile ==${number})&page=0&size=10&sort=createdDate,desc`).toPromise();
  }

  getCenterUsersList(centerId) {
    return this.httpClient.get(`${this.api}/centergroup/search/center?centerid=${centerId}`).toPromise();
  }

  async updateCenterGroup(id, params) {
    return this.httpClient.patch(`${this.api}/center/group`, params).toPromise();
  }

  getCenterByUserId(id: number) {
    return this.httpClient.get(`${this.api}/center/list/${id}`).toPromise();
  }
  getCocoonProcCenters() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=COCOON&centerType=PROCUREMENT&sort=createdDate,desc').toPromise();
  }
  getCocoonSalesCenters() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=COCOON&centerType=SALES&sort=createdDate,desc').toPromise();
  }
  getPupaeProcCenters() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=PUPAE&centerType=PROCUREMENT&centerType=SALES&sort=createdDate,desc').toPromise();
  }
  getCoProcCenters() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=COCOON&centerType=PROCUREMENT&sort=createdDate,desc').toPromise();
  }
  getTussarProcCenters() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=TUSSAR&centerType=PROCUREMENT&centerType=SALES&sort=createdDate,desc').toPromise();
  }
  getCocoonCenters() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=COCOON&sort=createdDate,desc').toPromise();
  }

  getCottonProcCenters() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=COTTON&sort=createdDate,desc').toPromise();
  }

  getCottonBALESCenters() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=COTTONBALES&sort=createdDate,desc').toPromise();
  }

  // upload Price sheet Apprroval maangments API's
  uploadCenterePriceSheet(file) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    // headers.append('Accept', 'application/json');
    // headers.append('responseType', 'text');
    // let options = { headers: headers,responseType: 'text' };
    return this.httpClient.post(`${this.api}/rmcapprovel/centrerateplan`, formData, { headers }).toPromise();
  }
  async getCenterPriceSheet(entityValues) {
    if (entityValues != undefined) {
      return this.httpClient.get(`${this.api}/search/rmrulebook/spec?search=(event.entityId=in=(${entityValues}) and (activeStatus==true))&page=0&size=100`).toPromise();
    } else {
      return this.httpClient.get(`${this.api}/search/rmrulebook/spec?page=0&size=10`).toPromise();

    }
  }

  async downLoadSamplePriceSheet() {
    return this.httpClient.get(`${this.api}/rmcapprovel/rmcsampleformat`).toPromise();
  }
  getUserGroupData(centerId, Userid) {
    return this.httpClient.get(`${this.api}/centergroup/search/usercenter?centerid=${centerId}&userid=${Userid}`).toPromise();
  }
  getGovtMandiRates() {
    // return this.httpClient.get(`${this.api}/rmcocoonmandi`).toPromise();
    return this.httpClient.get(`${this.api}/search/rmcocoonmandi/spec?search=(activeStatus==true)&page=0&size=40`).toPromise();
  }

  // approval flow API's
  createApprovalTicket(reqObj) {
    return this.httpClient.post(`${this.approval_API}/cocoonapproval/createticket`, reqObj).toPromise();
  }
  updateApprovalTicket(reqObj) {
    return this.httpClient.post(`${this.approval_API}/cocoonapproval/updateStatus`, reqObj).toPromise();
  }
  getUserGroupByUserIdUserid(Userid) {
    return this.httpClient.get(`${this.api}/centergroup/search/user?id=${Userid}`).toPromise();
  }
  getStagingEntitiesById(reqObj) {
    return this.httpClient.post(`${this.api}/skubatch/getstagingentities`, reqObj).toPromise()
  }

  updateStagingEntitiesById(id, reqObj) {
    return this.httpClient.patch(`${this.api}/stagingentities/${id}`, reqObj).toPromise()
  }

  getTicketDetails(reqObj) {
    return this.httpClient.get(`${this.approval_API}/cocoonapproval/spec?${reqObj}`).toPromise()
  }


  async getBarcodePrinters() {
    return this.httpClient.get(this.api + '/enums/barcodeprinters').toPromise();
  }

  async getAllTussarReelersListByPage(page, size, column, direction) {
    page = page ? page : 0;
    size = size ? size : 10;
    return this.httpClient.get(this.api + '/search/reeler/spec?search=(productType=in="Tussar") &page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  ///------------------------Tussar-Lot------------------------------------------

  getAllTussarList(page, size, column, direction, status) {
    page = page ? page : 0;
    size = size ? size : 10;
    // return this.httpClient.get(`${this.api}/tussarsvc/search/tussarlot/spec?page=0&size=10&sort=createdDate,desc`).toPromise();
    if (!status) {
      return this.httpClient.get(this.tussar_API + '/search/tussarlot/spec?' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

    } else {
      return this.httpClient.get(this.tussar_API + '/search/tussarlot/spec?search=status=in=' + status + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

    }
  }

  async updateTussarLotById(lotId, param) {
    return this.httpClient.patch(this.tussar_API + '/tussarlot' + lotId, param).toPromise();
  }

  async patchTussarLotById(id, params) {
    return this.httpClient.patch(this.tussar_API + '/tussarlot/' + id, params).toPromise();
  }

  getTussarReelarPayments(tussarId) {
    return this.httpClient.get(this.tussar_API + '/salesorder/' + tussarId + '/reelerpayment?sort=createdDate,desc').toPromise();
  }

  //-------------------------------------------------------------------------------------------


  async addLogisticDetails(id, payload) {
    return this.httpClient.patch(this.api + '/yarnorderreturn/' + id, payload).toPromise();
  }

  async reciveGoods(id, payload) {
    return this.httpClient.patch(this.api + '/yarnorderreturn/' + id, payload).toPromise();
  }

  getConfigByConfig(config) {
    return this.httpClient.get(`${this.api}/rmconfigs/search/config?config=${config}`).toPromise();
  }


  getAllTussars(page, size, column, direction, status) {
    page = page ? page : 0;
    size = size ? size : 10;
    return this.httpClient.get(this.tussar_API + '/search/tussarlot/spec?page=0&size=10&sort=createdDate,desc').toPromise();
    // if(!status){

    //   return this.httpClient.get(this.api + '/tussarsvc/search/tussarlot/spec?search=status=in=(New,Sold)' + '&page='+ page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

    // } else {

    //   return this.httpClient.get(this.api + '/tussarsvc/search/tussarlot/spec?search=status=in=' + status +  '&page='+ page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
    // }

  }
  updateSalesOrderReceipt(id, param) {
    return this.httpClient.patch(`${this.api}/salesorder/${id}/receipts`, param).toPromise();
  }

  createDraftRetailerSalesOrder(param) {
    return this.httpClient.post(this.api + '/salesorder/draft', param).toPromise();
  }


  getYarnorderReturnById(query) {
    return this.httpClient.get(`${this.api}/search/yarnorderreturn/spec?${query}`).toPromise();
  }

  createYarnOrderReturn(reqObj) {
    return this.httpClient.post(this.api + '/yarnorderreturn/', reqObj).toPromise()
  }

  patchYarnOrder(yarnReturnOrderId, reqObj) {
    return this.httpClient.patch(this.api + '/yarnorderreturn/' + yarnReturnOrderId, reqObj).toPromise();
  }

  approveYarnOrderReturn(status, yarnReturnId, payload) {
    return this.httpClient.patch(this.api + `/yarnorderreturn/${yarnReturnId}/${status}?action=APPROVE`, payload).toPromise()
  }

  getyarnorderDetailsById(id) {
    return this.httpClient.get(`${this.api}/yarnorder/${id}`).toPromise()
  }

  getAllWeaverSearch(query) {
    return this.httpClient.get(`${this.api}/search/weaver/spec?search=${query}`).toPromise();
  }

  getDraftRetailerSalesOrder(id) {
    return this.httpClient.get(this.api + '/salesorder/draft/' + id).toPromise();
  }

  updateDraftRetailerSalesOrder(id, param) {
    return this.httpClient.patch(this.api + '/salesorder/draft/' + id, param).toPromise();
  }

  getAllSalesOrderDiscountReason() {
    return this.httpClient.get(this.api + '/enums/salesorderdiscountreasons/').toPromise();
  }

  async getSourcingLocations() {
    return this.httpClient.get(this.yarnLotAPI + '/yarn/procurement/srclocations').toPromise();
  }

  async getCamundaID(externalId, entityType, status) {
    return this.httpClient.get(this.api + '/platwfmgmtsvc/workflowmanagement/alltask/spec?externalId=' + externalId + '&entityType=' + entityType).toPromise();

  }


  getExperianFullreport(phoneNumber) {
    return this.httpClient.get(`${this.api}/creditscoresvc/consumer/report?contactNo=${phoneNumber}`).toPromise();
  }

  getPrecisaBankStatement(leadId) {
    return this.httpClient.get(`${this.api}/precisasvc/precisaAnalysisResult/search/findByLeadId?leadId=${leadId}`).toPromise();
  }


  getStagingEntityDetails(entityId) {
    return this.httpClient.get(`${this.api}/lmsworkflowsvc/stagingentity/${entityId}`).toPromise();
  }

  patchStagingEntityDetails(entityId, payload) {
    return this.httpClient.patch(`${this.api}/lmsworkflowsvc/stagingentity/${entityId}`, payload).toPromise();
  }

  postPnlData(payload: any) {
    return this.httpClient.post(`${this.api}/mudracustomersvc/cam/add/profitloss/input`, payload).toPromise();
  }

  getPnlData(id: string) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/cam/profitloss/${id}`).toPromise();
  }

  postDataOutput(payload: any) {
    return this.httpClient.post(`${this.api}/mudracustomersvc/cam/add/dataoutput`, payload).toPromise();
  }

  getDataOutput(id: string) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/cam/dataoutput/${id}`).toPromise();
  }

  getCamReport(leadUU_ID: string) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/cam/${leadUU_ID}`).toPromise();
  }

  getRAROC_Details(url: string) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/cam/populate/raroc?csvUrl=${url}`).toPromise();
  }

  postCamReport(payload) {
    return this.httpClient.post(`${this.api}/mudracustomersvc/cam/add`, payload).toPromise();
  }

  downLoadCamReport(leadId) {
    return this.httpClient.get(`${this.api}/mudracustomersvc/report/cam/${leadId}`, { responseType: 'arraybuffer' }).toPromise();
  }
  getTussarsLotById(id: number) {
    return this.httpClient.get(`${this.tussar_API}/tussarlot/${id}`).toPromise();
  }

  async searchTussarLot(page, size, column, direction, params) {
    return this.httpClient.get(this.tussar_API + '/search/tussarlot/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  async markTussarLotAsSold(reqObj) {
    return this.httpClient.post(this.tussar_API + '/salesorder', reqObj).toPromise();
  }
  async patchTussarOrder(reqObj, id) {
    return this.httpClient.patch(this.tussar_API + '/salesorder/' + id, reqObj).toPromise();
  }

  async deleteTussarLot(id) {
    return this.httpClient.delete(this.tussar_API + '/tussarlot/' + id).toPromise();
  }

  async getAllTussarSalesOrderListByPage(page, size, column, direction, status) {
    page = page ? page : 0;
    size = size ? size : 10;
    if (!status) {
      return this.httpClient.get(this.tussar_API + '/search/salesorder/spec?search=orderPaymentStatus=in=(Paid,Pending)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

    } else {
      return this.httpClient.get(this.tussar_API + '/search/salesorder/spec?search=orderPaymentStatus=in=' + status + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();

    }
  }
  async deleteTussarSalesOrderOrderById(id) {
    return this.httpClient.delete(this.tussar_API + '/salesorder/' + id).toPromise();
  }

  async searchTussarSalesOrder(page, size, column, direction, params) {
    return this.httpClient.get(this.tussar_API + '/search/salesorder/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  async getTussarSalesOrderById(id) {
    return this.httpClient.get(this.tussar_API + '/salesorder/' + id).toPromise();
  }
  async patchTussarlotByid(id, payload) {
    return this.httpClient.patch(this.tussar_API + `/tussarlot/${id}`, payload).toPromise();
  }
  async getTussarlotByid(id) {
    return this.httpClient.get(this.tussar_API + `/tussarlot/${id}`).toPromise();
  }

  async getAllTusserLots() {
    return this.httpClient.get(this.tussar_API + '/search/tussarlot/spec?page=0&size=10&sort=createdDate,desc').toPromise();
  }
  async postTussarSales() {
    return this.httpClient.get(this.tussar_API + '/tussarlotsalesorder').toPromise();
  }
  getTussarListEstimateTotal(reqObj) {
    return this.httpClient.post(this.tussar_API + '/salesorder/estimate', reqObj).toPromise();
  }
  async tussarFarmerPayment(param) {
    return this.httpClient.post(this.tussar_API + '/tussarfarmerpayout', param).toPromise();
  }
  async tussarPayReelerDueAmount(reqObj) {
    return this.httpClient.post(this.tussar_API + '/tussarreelerpayment', reqObj).toPromise();
  }

  async getTussarCentersList() {
    return this.httpClient.get(this.api + '/center?businessVertical=RESHAFARMS&division=TUSSAR&centerType=PROCUREMENT&sort=createdDate,desc').toPromise();
  }

  // rearingIot api's
  getRearingDeviceDataByID(deviceID) {
    return this.httpClient.get(`${this.rearingIot_service}/deviceallocation/${deviceID}`).toPromise();
  }
  patchRiotAgronimistdata(id, reqObj) {
    return this.httpClient.patch(`${this.rearingIot_service}/deviceallocation/${id}`, reqObj).toPromise();
  }

  async cancelInvoice(reqObj) {
    return this.httpClient.post(this.api + '/invoices/salesorder/cancel', reqObj).toPromise();
  }

  async getInvoiceCancellationReason() {
    return this.httpClient.get(this.api + '/enums/cancellationreasons').toPromise();
  }

  async getEInvoiceAndEwayVisiblity(salesOrderId) {
    return this.httpClient.get(this.api + `/salesorder/${salesOrderId}/invoicebuttons`).toPromise();
  }
  async getParentQuests(parentRequestId) {
    return this.httpClient.get(this.api + `/skubatch/getPrevTaskResponse?requestId=${parentRequestId}`).toPromise();
  }

  async getRatings(leadUUID) {
    return this.httpClient.get(this.api + `/mudracustomersvc/cam/rating/lead/${leadUUID}`).toPromise();
  }

  async saveRatings(payload) {
    return this.httpClient.post(this.api + `/mudracustomersvc/cam/rating`, payload).toPromise();
  }
  async calculateRating(payload) {
    return this.httpClient.put(this.api + `/mudracustomersvc/cam/calculate/rating`, payload).toPromise();
  }

  async getBussinesRatings(leadUUID) {
    return this.httpClient.get(this.api + `/mudracustomersvc/cam/rating/business/risk/lead/${leadUUID}`).toPromise();
  }

  async saveBankRatings(payload) {
    return this.httpClient.post(this.api + `/mudracustomersvc/cam/rating/business/risk`, payload).toPromise();
  }

  async calculateBankRating(payload) {
    return this.httpClient.put(this.api + `/mudracustomersvc/cam/calculate/business/risk`, payload).toPromise();
  }


  async getManagementRatings(leadUUID) {
    return this.httpClient.get(this.api + `/mudracustomersvc/cam/rating/management/risk/lead/${leadUUID}`).toPromise();
  }
  // {{mudra-customer-service}}/cam/rating/management/risk/lead/cdf6a68a-d2f1-4548-a000-e2b7297d504e

  async saveManagementRatings(payload) {
    return this.httpClient.post(this.api + `/mudracustomersvc/cam/rating/management/risk`, payload).toPromise();
  }

  async calculateManagementRating(payload) {
    return this.httpClient.put(this.api + `/mudracustomersvc/cam/calculate/management/risk`, payload).toPromise();
  }
  async getExternalRating() {
    return this.httpClient.get(this.api + `/mudracustomersvc/externalrating`).toPromise();
  }
  async getExternalagency() {
    return this.httpClient.get(this.api + `/mudracustomersvc/externalagency`).toPromise();
  }

  createLogisticsShippment(reqObj) {
    return this.httpClient.post(`${this.logistic_api}/shipment/`, reqObj).toPromise();
  }
  c2yPayout(reqObj) {
    return this.httpClient.post(`${this.api}/yarnprocsvc/c2y/payment`, reqObj).toPromise();
  }

  getRearingIotDeviceDetails(id) {
    return this.httpClient.get(`${this.api}/devicemgmtsvc/mobile/devicedetail/${id}?serviceType=REARING`).toPromise();
  }
  getRearingIotDeviceByID(id) {
    return this.httpClient.get(`${this.api}/devicemgmtsvc/device/${id}`).toPromise();

  }
  cancelSkuBatch(reqObj, batchId) {
    return this.httpClient.post(`${this.api}/skubatch/${batchId}/cancelskubatch`, reqObj).toPromise();
  }

  getRearingIotAdvisorylist() {
    return this.httpClient.get(this.api + '/riotsvc/search/ticket/spec?page=0&size=20&sort=farmername,asc').toPromise();

  }

  approvePayments(id) {
    return this.httpClient.post(`${this.PAYOUT_API}/payoutapproval/updateStatus`, id).toPromise();
  }

  cancelPayoutTicket(id) {
    return this.httpClient.patch(this.PAYOUT_API + `/payout/cancel/${id}`, {}).toPromise();
  }
  createSupplierPo(reqObj) {
    return this.httpClient.post(this.api + '/supplierpurchaseorder/create', reqObj).toPromise();
  }

  updateSupplierPo(id, reqObj) {
    return this.httpClient.patch(this.api + `/supplierpurchaseorder/update/${id}`, reqObj).toPromise();
  }

  updateSupplierPoStatus(id, status) {
    return this.httpClient.patch(this.api + `/supplierpurchaseorder/update/status/${id}?status=${status}`, {}).toPromise();
  }

  verifyGstCertifateForCustomer(gstNumber, role, userId) {
    return this.httpClient.get(this.api + `/kycsvc/kyc/gst?gstin=${gstNumber}&role=${role}&userId=${userId}&documentName='GST certificate'&documentId=5`).toPromise();
  }

  createCustomerBillToShippingAddress(customerId, customerType, reqObj) {
    return this.httpClient.post(this.api + `/${customerType}address/${customerId}`, reqObj).toPromise();
  }

  updateCustomerBillToShippingAddress(customerId, customerType, reqObj) {
    return this.httpClient.patch(this.api + `/${customerType}address/${customerId}`, reqObj).toPromise();
  }

  getCustomerAdresses(customerType, customerId) {
    return this.httpClient.get(this.api + `/${customerType}address/${customerId}`).toPromise();

  }
  generateSupplierPo(reqObj) {
    return this.httpClient.put(this.api + `/invoices/supplierpurchaseorder/SPO`, reqObj).toPromise();
  }

  verifySpinningMillGstKyc(payload) {
    return this.httpClient.post(`${this.COTTON_API}/spinningmillkyc`, payload).toPromise();
  }
  async getGstFromState(selctedState, division, verticle) {
    return this.httpClient.get(this.api + `/search/gstdetails/spec?search=address.state==('${selctedState}')&businessDivision==${division}&6businessVertical==${verticle}&page=0&size=1000&sort=createdDate,desc
  `).toPromise();
  }

  // payout cart service
  createPayoutRequest(reqObj) {
    return this.httpClient.post(this.Payment_Cart_api + '/cart/payout', reqObj).toPromise();
  }
  patchPayoutRequest(reqObj) {
    return this.httpClient.patch(this.Payment_Cart_api + '/cart/payout', reqObj).toPromise();
  }
  payoutInitiateOtp(params) {
    return this.httpClient.post(this.PAYOUT_API + '/payoutapproval/otp/generate', params).toPromise();
  }
  payoutVerifyOtp(reqObj) {
    return this.httpClient.post(this.PAYOUT_API + '/payoutapproval/otp/verify', reqObj).toPromise();
  }

  saveSupplierPoDocuments(id, reqObj) {
    return this.httpClient.patch(this.api + `/supplierpurchaseorder/${id}/receipts`, reqObj).toPromise();
  }
  estimatedInventoryList(selectedStatus) {
    return this.httpClient.get(this.COTTON_API + `/cotton/cottonbaleestimatedinventory?warehouseIds=${selectedStatus}`).toPromise();
  }

  //

  avalibaleInventoryList(selectedStatus) {
    return this.httpClient.get(this.COTTON_API + `/availableinventory/total?warehouse=${selectedStatus}`).toPromise();
  }

  //updateout-ton-process
  updateOutTonProcess(params, id, ratePerKg) {
    return this.httpClient.patch(this.COTTON_API + `/cotton/outtonprocess?cottonLotId=${id}&buyingPricePerKg=${ratePerKg}`, params).toPromise();
  }
  // cotton contract manufactureing API list
  //get all manufactured list

  getAllManufacturedList(paginationData, search: any = false) {
    const searchQuery = search ? `search=${search}&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}` : `page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=${paginationData.currentColumn},${paginationData.currentDirection}`;
    return this.httpClient.get(`${this.COTTON_API}/search/cblistingavailability/spec?${searchQuery}`).toPromise();
    // return this.httpClient.get(this.COTTON_API + `/search/cblistingavailability/spec?search=currentLocation=${selectedStatus}&page=0&size=10&sort=createdDate,desc`).toPromise();

  }

  //create stock transfer
  createStockTransfer(params) {
    return this.httpClient.post(this.logistic_api + '/shipment/', params).toPromise();
  }
  //get All vehicale type
  //bale purchase list
  getBalePurchases() {
    return this.httpClient.get(this.COTTON_API + '/search/cottonbalelisting/spec?page=0&size=10&sort=createdDate,desc').toPromise();
  }
  // cotton contract manufactureing API list
  createPricesheetForCandy(reqObj) {
    return this.httpClient.post(this.api + '/rmcapprovel/warehouserateplan', reqObj).toPromise();
  }
  getListOfWareHouses() {
    return this.httpClient.get(this.api + '/search/warehouse/spec?search=(activeWarehouse==true)&page=0&size=10005&sort=createdDate,desc').toPromise();
  }
  getPriceDataOfWarehouse() {
    return this.httpClient.get(this.api + '/search/rmrulebook/spec?page=0&size=100&sort=createdDate,desc&search=(event.type==WAREHOUSE_SALES_APPROVAL and (activeStatus==true))').toPromise();
  }

  //create contract
  createContractForm(params: any) {
    return this.httpClient.post(`${this.COTTON_API}/contractdetail`, params).toPromise();
  }

  //update Contract Status
  updateContractStatus(reqObj, contractorid) {
    return this.httpClient.patch(this.COTTON_API + `/contractdetail/${contractorid}`, reqObj).toPromise();
  }
  updateContract(contractorid, reqObj) {
    return this.httpClient.patch(this.COTTON_API + `/contractdetail/${contractorid}`, reqObj).toPromise();
  }
  updateInaciveContract(contractorid, ginnerId) {
    return this.httpClient.patch(this.COTTON_API + `/cotton/contractStatus?contractId=${contractorid}&ginnerId=${ginnerId}`, '').toPromise();
  }
  //
  searchAllContract(ginnerId, paginationData) {
    return this.httpClient.get(`${this.COTTON_API}/search/ginner/contract/spec?search=(ginner.id==${ginnerId})&page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=createdDate,desc`).toPromise()
  }



  async searchAllDeviceSerialId(page, size, column, direction, params) {
    return this.httpClient.get(this.deviceManagement_API + '/device/search/spec?search=' + params + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
  }

  // bale production Apis

  startCottonBaleProduction(reqObj) {
    return this.httpClient.post(this.COTTON_API + `/cottonbaleproduction`, reqObj).toPromise();
  }
  endCottonBaleProduction(reqObj) {
    return this.httpClient.post(this.COTTON_API + `/production/end`, reqObj).toPromise();
  }
  recordBaleWeights(reqObj) {
    return this.httpClient.post(this.COTTON_API + `/production/listing`, reqObj).toPromise();

  }
  async getCottonLogisticsList(page, size, column, direction, status, dispatchedStatus) {
    if (status && dispatchedStatus) {
      return this.httpClient.get(this.logistic_api + '/logistics/dispatchorder/spec?search=payoutStatus=in=' + status + ' and status=in=' + dispatchedStatus + ' and dispatchOrderType==(MANUFACTURED_COTTON_BALES)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
    }
    else {
      if (!status) {
        return this.httpClient.get(this.logistic_api + '/logistics/dispatchorder/spec?search=payoutStatus=in=(Paid,Pending)' + ' and dispatchOrderType==(MANUFACTURED_COTTON_BALES)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
      }
      else {
        return this.httpClient.get(this.logistic_api + '/logistics/dispatchorder/spec?search=payoutStatus=in=' + status + ' and dispatchOrderType==(MANUFACTURED_COTTON_BALES)' + '&page=' + page + '&size=' + size + '&sort=' + column + ',' + direction).toPromise();
      }
    }
  }

  getAllActiveContractGinners() {
    return this.httpClient.get(`${this.COTTON_API}/cotton/ginners`).toPromise()
  }
  getAllInactiveContractGinners() {
    return this.httpClient.get(`${this.COTTON_API}/search/ginner/spec?search=(contractActive == false)&page=0&size=100000&sort=createdDate,desc`).toPromise()
  }
  

  //update chawki date
  updtedchawki(farmerid,reqobj)
  {
    return this.httpClient.patch(this.api +`/farmer/${farmerid}`,reqobj).toPromise();
  }

  onlifeCycleTracker(payload) {
    return this.httpClient.post(`${this.rearingIot_service}/lifecycletracker`, payload).toPromise();
  }
  //create Advisory
  createAdvisory(payload)
  {
    return this.httpClient.post(`${this.rearingIot_service}/followupnote`,payload).toPromise();
  }
  //get advisory list
    getAllAdvisoryList(silkFarmerDeviceAllocationId)
    {
      return this.httpClient.get(`${this.rearingIot_service}/search/followupnote/spec/?search=(silkFarmerDeviceAllocationId==${silkFarmerDeviceAllocationId})`).toPromise();

    }
    //
    getRearingAllAdvisoryList(silkFarmerDeviceAllocationId){
      return this.httpClient.get(`${this.rearingIot_service}/search/ticket/spec?search=(type==ADVISORY and deviceAllocationId==${silkFarmerDeviceAllocationId})&page=0&size=20&sort=farmerName,asc`).toPromise();
    }

    getTicketDetailes(farmerid:any)
    {
      return this.httpClient.get(`${this.rearingIot_service}/search/ticket/spec?search=(type==ADVISORY and farmerId==${farmerid})&page=0&size=1&sort=createdDate,desc`).toPromise();
    }
    //get Alls seeds sales order list
    getAllSeedsPurchaseList(){
      return this.httpClient.get(`${this.COTTON_API}/cottonseedssalesorder`).toPromise()
    }
    //cretae seeds payment Detailes
    createSeedsPayoutDetails(payload){
      return this.httpClient.post(`${this.COTTON_API}/ginnerseedspayout`,payload).toPromise()
    }
    getAllCottonSeedsPurchaseList(paginationData){
      return this.httpClient.get(`${this.COTTON_API}/search/cottonseedslot/spec?page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=createdDate,desc`).toPromise()
    } 
    getCottonSeedsById(lotid){
      return this.httpClient.get(`${this.COTTON_API}/cottonseedslot/${lotid}`).toPromise()
    }
    
    // searchAllOilMills( selectedStatus ) {
    //   return this.httpClient.get(this.COTTON_API + '/search/oilmill/spec?search').toPromise();
    // }
    // searchOilMillbyId(id: number) {
    //   return this.httpClient.get(`${this.COTTON_API}/oilmill/${id}`).toPromise();
    // }
    // createSalesOrder(payload){
    //   return this.httpClient.post(`${this.COTTON_API}/cottonseedssalesorder`,payload).toPromise()
    // }
    createSeedsPurchaseOrder(payload){
      return this.httpClient.post(`${this.COTTON_API}/cottonseedslot`,payload).toPromise()
    }
    createSeedsPurchaseOrderById(id,payload,){
      return this.httpClient.patch(`${this.COTTON_API}/cottonseedslot/${id}`,payload).toPromise()
      
    }

      //oil mill
      searchAllOilMills( selectedStatus ) {
        return this.httpClient.get(this.COTTON_API + '/search/oilmill/spec?search').toPromise();
      }
     // create cotton-sales order
     createSalesOrder(payload) {
      return this.httpClient.post(`${this.COTTON_API}/cottonseedssalesorder`, payload).toPromise();
     }
     
  
     //create seeds  payment Detailes
     createSeedsPaymentDetails(payload){
      return this.httpClient.post(`${this.COTTON_API}/oilmillpayment`, payload).toPromise();
     }
     //
     searchOilMillbyId(id: number) {
      return this.httpClient.get(`${this.COTTON_API}/oilmill/${id}`).toPromise();
    }
    //get All cotton sales order
    allCottonSalesOrderList(paginationData){
      return this.httpClient.get(`${this.COTTON_API}/search/cottonseedssalesorder/spec?page=${paginationData.currentPage}&size=${paginationData.pageSize}&sort=createdDate,desc`).toPromise()
    }
    createSeedsPriceSheet(reqObj){
      return this.httpClient.post(`${this.api}/rmcapprovel/seedswarehouserateplan`, reqObj).toPromise();

    }
    getPriceWarehouse() {
      return this.httpClient.get(this.api + '/search/rmrulebook/spec?page=0&size=100&sort=createdDate,desc&search=(event.type==COTTON_SEEDS_WAREHOUSE_APPROVAL and (activeStatus==true))').toPromise();
    }
    
    createManualCottonBaleIventory(payload) {
      return this.httpClient.post(`${this.COTTON_API}/cblisting`, payload).toPromise();
    }
    
    getManualCottonBaleLotDetails(selectedid){
    return this.httpClient.get(this.COTTON_API + `/availableinventory/total?warehouse=${selectedid}`).toPromise();
    }
    //get seeds price-sheet
    getPriceSheetOfWarehouse() {
      return this.httpClient.get(this.api + '/search/rmrulebook/spec?page=0&size=100&sort=createdDate,desc&search=(event.type==COTTON_SEEDS_WAREHOUSE_APPROVAL and (activeStatus==true))').toPromise();
    }
    // create seeds price sheet
   

}
