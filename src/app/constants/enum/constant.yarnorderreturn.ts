export const YARN_ORDER_RETURN_STATUS={
    // DRAFT, NEW, APPROVED, REQUEST_FOR_LOGISTICS, SHIPPED, RECEIVED
    NEW:[
       { name:'NEW',isDisabled : false },
       { name:'APPROVED',isDisabled : false },
       { name:'SHIPPED',isDisabled : true },
       { name:'REQUEST_FOR_LOGISTICS',isDisabled : true },
       { name:'CANCELLED',isDisabled : false },
       { name:'RECEIVED',isDisabled : true },
    ],
    Received:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'SHIPPED',isDisabled : true },
        { name:'REQUEST_FOR_LOGISTICS',isDisabled : true },
        { name:'CANCELLED',isDisabled : true },
        { name:'RECEIVED',isDisabled : false },
     ],
    APPROVED:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'SHIPPED',isDisabled : true },
        { name:'REQUEST_FOR_LOGISTICS',isDisabled : false },
        { name:'CANCELLED',isDisabled : true },
        { name:'RECEIVED',isDisabled : true },
    ],
    SHIPPED:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'SHIPPED',isDisabled : true },
        { name:'REQUEST_FOR_LOGISTICS',isDisabled : true },
        { name:'CANCELLED',isDisabled : true },
        { name:'RECEIVED',isDisabled : false },
    ],
    REQUEST_FOR_LOGISTICS:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'SHIPPED',isDisabled : false },
        { name:'REQUEST_FOR_LOGISTICS',isDisabled : false },
        { name:'CANCELLED',isDisabled : true },
        { name:'RECEIVED',isDisabled : true },
    ],
    CANCELLED:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'SHIPPED',isDisabled : true },
        { name:'REQUEST_FOR_LOGISTICS',isDisabled : true },
        { name:'CANCELLED',isDisabled : true },
        { name:'RECEIVED',isDisabled : true },
    ]
}