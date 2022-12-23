export const WEAVER_RETURN_STATUS={
    NEW:[
       { name:'NEW',isDisabled : false },
       { name:'APPROVED',isDisabled : false },
       { name:'INTRANSIT',isDisabled : true },
       { name:'COMPLETED',isDisabled : true },
       { name:'CANCELLED',isDisabled : false },
    ],
    APPROVED:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : false },
        { name:'INTRANSIT',isDisabled : false },
        { name:'COMPLETED',isDisabled : true },
        { name:'CANCELLED',isDisabled : true },
    ],
    INTRANSIT:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'INTRANSIT',isDisabled : false },
        { name:'COMPLETED',isDisabled : false },
        { name:'CANCELLED',isDisabled : true },
    ],
    COMPLETED:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'INTRANSIT',isDisabled : true },
        { name:'COMPLETED',isDisabled : false },
        { name:'CANCELLED',isDisabled : true },
    ],
    CANCELLED:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'INTRANSIT',isDisabled : true },
        { name:'COMPLETED',isDisabled : true },
        { name:'CANCELLED',isDisabled : false },
    ],
    APPROVAL_PENDING: [
        { name:'NEW',isDisabled : true },
        { name:'APPROVAL_PENDING',isDisabled : false },
        { name:'APPROVED',isDisabled : true },
        { name:'INTRANSIT',isDisabled : true },
        { name:'COMPLETED',isDisabled : true },
        { name:'CANCELLED',isDisabled : true },
    ]
}