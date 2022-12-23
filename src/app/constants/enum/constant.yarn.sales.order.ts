export const SO_STATUS={
    Draft:[
        { name:'Draft',isDisabled : false },
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Delivered',isDisabled : true },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : true }
    ],
    New:[
        { name:'Draft',isDisabled : true },
       { name:'New',isDisabled : false },
       { name:'Shipped',isDisabled : false },
       { name:'Delivered',isDisabled : true },
       { name:'Completed',isDisabled : true },
       { name:'Cancel',isDisabled : false },
    ],
    Shipped:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : false },
        { name:'Delivered',isDisabled : false },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : true },
    ],
    Delivered:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Delivered',isDisabled : false },
        { name:'Completed',isDisabled : false },
        { name:'Cancel',isDisabled : true },
    ],
    Completed:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Delivered',isDisabled : true },
        { name:'Completed',isDisabled : false },
        { name:'Cancel',isDisabled : true },
    ],
    Cancel:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Delivered',isDisabled : true },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : false },
    ],
    Rejected:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Delivered',isDisabled : true },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : true },
        { name:'Rejected',isDisabled : false },
    ]

}

