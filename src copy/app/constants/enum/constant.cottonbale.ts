export const COTTON_BALE_STATUS={
    NEW:[
       { name:'NEW',isDisabled : false },
       { name:'READYFORSHIPMENT',isDisabled : false },
       { name:'SHIPPED',isDisabled : true },
       { name:'DELIVERED',isDisabled : true },
       { name:'CANCELED',isDisabled : false },

    ],
    READYFORSHIPMENT:[
        { name:'NEW',isDisabled : true },
        { name:'READYFORSHIPMENT',isDisabled : false },
        { name:'SHIPPED',isDisabled : false },
        { name:'DELIVERED',isDisabled : true },
        { name:'CANCELED',isDisabled : false },
    ],
    SHIPPED:[
        { name:'NEW',isDisabled : true },
       { name:'READYFORSHIPMENT',isDisabled : true },
       { name:'SHIPPED',isDisabled : false },
       { name:'DELIVERED',isDisabled : false },
       { name:'CANCELED',isDisabled : true },
    ],
    CANCELED:[
        { name:'NEW',isDisabled : true },
        { name:'READYFORSHIPMENT',isDisabled : true },
        { name:'SHIPPED',isDisabled : true },
        { name:'DELIVERED',isDisabled : true },
        { name:'CANCELED',isDisabled : false },
    ],
    DELIVERED:[
        { name:'NEW',isDisabled : true },
       { name:'READYFORSHIPMENT',isDisabled : true },
       { name:'SHIPPED',isDisabled : true },
       { name:'DELIVERED',isDisabled : false },
       { name:'CANCELED',isDisabled : true },
    ],
}