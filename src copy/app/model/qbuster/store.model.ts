export interface Store{
    chainID: number;
    storeID: number;
    storeName: String;
    outletAddLine1: String;
    outletAddLine2: String;
    outletAddCity: String;
    outletAddState: String;
    outletAddPincode: number;
    outletAddCountry: String;
    minimumOrderValue: number;
    storeOpeningTime: number;
    storeClosingTime: number;
    latitude: number;
    longitude: number;
    deliveryZipCodes: String;
}