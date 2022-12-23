export interface ChargeData {
    additionalChargeID: number,
    metaChargeID: String,
    accountID: number,
    accountName: String,
    appliedOnLevel: String,
    name: String,
    nameOnBill: String,
    chargeType: String,
    value: number,
    creationTimeLocal: String,
    creationTimeUTC: String,
    timezone: String,
    taxIDs: String,
    applyOnOrderDelivery: number,
    maximumOrderValue: number,
    isActive: number,
    additionalChargeName: String
}