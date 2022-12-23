import { ChargeData } from "./chargeData.model";
import { Product } from "./product.model";
import { Tax } from "./taxData.model";

export interface OnlineProduct{
    status: Boolean,
    catalogueData: Product[],
    totalRecordCount: number,
    message: String,
    apiTrackerID: String
    taxData: Tax[],
    chargeData: ChargeData[],
}