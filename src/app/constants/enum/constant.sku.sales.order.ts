export const SKU_SO_STATUS={
    Draft:[
        { name:'Draft',isDisabled : false },
        { name:'New',isDisabled : false },
        { name:'ReadyForShipment',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Received',isDisabled : true },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : true },
        {name: 'Rejected', isDisabled: true}
    ],
    New:[
       { name:'Draft',isDisabled : true },
       { name:'New',isDisabled : false },
       { name:'ReadyForShipment',isDisabled : false },
       { name:'Shipped',isDisabled : true },
       { name:'Received',isDisabled : true },
       { name:'Completed',isDisabled : true },
       { name:'Cancel',isDisabled : false },
       {name: 'Rejected', isDisabled: true}
    ],
    Shipped:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'ReadyForShipment',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Received',isDisabled : false },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : true },
        {name: 'Rejected', isDisabled: true}
    ],
    Received:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'ReadyForShipment',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Received',isDisabled : false },
        { name:'Completed',isDisabled : false },
        { name:'Cancel',isDisabled : true },
        {name: 'Rejected', isDisabled: true}
    ],
    Completed:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'ReadyForShipment',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Received',isDisabled : true },
        { name:'Completed',isDisabled : false },
        { name:'Cancel',isDisabled : true },
        {name: 'Rejected', isDisabled: true}
    ],
    Cancel:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'ReadyForShipment',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Received',isDisabled : true },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : true },
        {name: 'Rejected', isDisabled: true}
    ],
    ReadyForShipment:[
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'ReadyForShipment',isDisabled : false },
        { name:'Shipped',isDisabled : false },
        { name:'Received',isDisabled : true },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : true },
        {name: 'Rejected', isDisabled: true}
    ],
    Rejected: [
        { name:'Draft',isDisabled : true },
        { name:'New',isDisabled : true },
        { name:'ReadyForShipment',isDisabled : true },
        { name:'Shipped',isDisabled : true },
        { name:'Received',isDisabled : true },
        { name:'Completed',isDisabled : true },
        { name:'Cancel',isDisabled : true },
        {name: 'Rejected', isDisabled: false}
    ]

}

