export const COTTON_BALE_PO_STATUS={
    NEW:[
       { name:'NEW',isDisabled : false },
       { name:'PROCESSING',isDisabled : false },
       { name:'FULFILLED',isDisabled : true },
       { name:'CANCELED',isDisabled : false },
    ],
    PROCESSING:[
        { name:'NEW',isDisabled : true },
        { name:'PROCESSING',isDisabled : false },
        { name:'FULFILLED',isDisabled : true },
        { name:'CANCELED',isDisabled : false },
    ],
    FULFILLED:[
        { name:'NEW',isDisabled : true },
        { name:'PROCESSING',isDisabled : true },
        { name:'FULFILLED',isDisabled : false },
        { name:'CANCELED',isDisabled : true },
    ],
    CANCELED:[
        { name:'NEW',isDisabled : true },
       { name:'PROCESSING',isDisabled : true },
       { name:'FULFILLED',isDisabled : true },
       { name:'CANCELED',isDisabled : false },
    ]
}