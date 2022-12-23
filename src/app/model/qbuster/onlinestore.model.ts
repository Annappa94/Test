import { Store } from "./store.model";
export interface OnlineStore{
    status: Boolean;
    storeData: Store[];
    totalRecordCount: number;
    apiTrackerID: String;
    message: String;
}