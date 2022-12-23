export interface AllDevices{
    totalPages: number,
    totalElements: number,
    hasNext: Boolean,
    data:Device[]
}

export interface Device{
        id: Id,
        createdTime: number,
        additionalInfo:additionalInfo ,
        tenantId: tenantId,
        customerId: customerId,
        name: String,
        type: String,
        label: String,
        deviceProfileId: deviceProfileId,
        deviceData:deviceData
}

export interface Id{
    entityType: String,
    id: String
}
export interface additionalInfo{
    description: String
}
export interface tenantId{
    entityType: String,
    id: String
}
export interface customerId{
    entityType: String,
    id: String
}
export interface deviceProfileId {
    entityType: String,
    id: String
}
export interface deviceData{
    configuration:configuration,
    transportConfiguration:transportConfiguration
}
export interface configuration {
    type: String
}
export interface transportConfiguration{
    type: String
}