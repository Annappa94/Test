export interface Tax{
    taxID: number,
    metaTaxID: String,
    parentTaxID: number,
    accountID: number,
    accountName: String,
    taxName: String,
    nameOnBill: String,
    taxPercentage: number,
    isIGST: number,
    creationTimeLocal: String,
    creationTimeUTC: String,
    timezone: String,
    isActive: number
}