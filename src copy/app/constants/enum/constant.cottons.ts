export const COTTON_LOT_STATUS={
    NEW:[
       { name:'New',isDisabled : false },
       { name:'Purchased',isDisabled : false },
       { name:'Returned',isDisabled : true },
       { name:'Cancelled',isDisabled : false },
    ],
    PURCHASED:[
       { name:'New',isDisabled : true },
       { name:'Purchased',isDisabled : false },
       { name:'Returned',isDisabled : false },
       { name:'Cancelled',isDisabled : false },
    ],
    RETURENED:[
        { name:'New',isDisabled : true },
        { name:'Purchased',isDisabled : true },
        { name:'Returned',isDisabled : false },
        { name:'Cancelled',isDisabled : false },
    ],
    CANCELLED:[
        { name:'New',isDisabled : true },
        { name:'Purchased',isDisabled : true },
        { name:'Returned',isDisabled : true },
        { name:'Cancelled',isDisabled : false },
    ],
}