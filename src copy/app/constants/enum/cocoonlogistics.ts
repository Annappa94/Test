export const COCOON_LOGISTICS_STATUS={
    NEW:[
       { name:'New',isDisabled : false,value:"NEW" },
       { name:'Shipped',isDisabled : false, value:"SHIPPED" },
       { name:'Canceled',isDisabled : false, value:"CANCELLED" },
       { name:'Delivered',isDisabled : true, value:"DELIVERED"},
    ],
    SHIPPED:[
        { name:'New',isDisabled : true,value:"NEW" },
        { name:'Shipped',isDisabled : false, value:"SHIPPED" },
        { name:'Canceled',isDisabled : true, value:"CANCELLED" },
        { name:'Delivered',isDisabled : false, value:"DELIVERED" },   
    ],
    CANCELLED:[
        { name:'New',isDisabled : true, value:"NEW" },
       { name:'Shipped',isDisabled : true, value:"SHIPPED" },
       { name:'Canceled',isDisabled :  false, value:"CANCELLED"},
       { name:'Delivered',isDisabled : true, value:"DELIVERED" },
    ],
    DELIVERED:[
        { name:'New',isDisabled : true, value:"NEW" },
       { name:'Shipped',isDisabled : true, value:"SHIPPED" },
       { name:'Cancelled',isDisabled : true, value:"CANCELLED" },
       { name:'Delivered',isDisabled : false, value:"DELIVERED" },
    ],
}