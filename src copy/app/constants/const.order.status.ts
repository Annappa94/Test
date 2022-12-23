export const SO_STATUS = {
    New:[
       { name:'New',isDisabled : false },
       { name:'Shipped',isDisabled : false },
       { name:'Delivered',isDisabled : true },
       { name:'Completed',isDisabled : true },
       { name:'Cancel',isDisabled : false },
    ],
    Shipped:[
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : false },
        { name:'Delivered',isDisabled : false },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : false },
    ],
    Delivered:[
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Delivered',isDisabled : false },
        { name:'Completed',isDisabled : false },
        { name:'Cancel',isDisabled : false },
    ],
    Completed:[
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Delivered',isDisabled : true },
        { name:'Completed',isDisabled : false },
        { name:'Cancel',isDisabled : false },
    ],
    Cancel:[
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Delivered',isDisabled : true },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : false },
    ],

}

