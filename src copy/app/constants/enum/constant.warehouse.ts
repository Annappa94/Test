export const WAREHOUSE_BID_STATUS={
    CURR_NEW:[
       { name:'NEW',isDisabled : false },
       { name:'INPROGRESS',isDisabled : false },
       { name:'COMPLETED',isDisabled : true },
       { name:'CANCELLED',isDisabled : false },
    ],
    CURR_INPROGRESS:[
        { name:'NEW',isDisabled : false },
        { name:'INPROGRESS',isDisabled : false },
        { name:'COMPLETED',isDisabled : true },
        { name:'CANCELLED',isDisabled : false },
     ],
    CURR_COMPLETED:[
        { name:'NEW',isDisabled : true },
        { name:'INPROGRESS',isDisabled : true },
        { name:'COMPLETED',isDisabled : true },
        { name:'CANCELLED',isDisabled : true },
     ],
    CURR_CANCELLED:[
        { name:'NEW',isDisabled : true },
        { name:'INPROGRESS',isDisabled : true },
        { name:'COMPLETED',isDisabled : true },
        { name:'CANCELLED',isDisabled : true },
     ],

}