export const RETAILER_PO_STATUS={
    New:[
       { name:'New',isDisabled : false },
       { name:'Processing',isDisabled : false },
       { name:'PartiallyFulfilled',isDisabled : true },
       { name:'Fulfilled',isDisabled : true },
       { name:'Cancelled',isDisabled : false }
    ],
    Processing:[
        { name:'New',isDisabled : true },
        { name:'Processing',isDisabled : false },
        { name:'PartiallyFulfilled',isDisabled : false },
        { name:'Fulfilled',isDisabled : true },
        { name:'Cancelled',isDisabled : true }
    ],
    PartiallyFulfilled:[
        { name:'New',isDisabled : true },
        { name:'Processing',isDisabled : true },
        { name:'PartiallyFulfilled',isDisabled : true },
        { name:'Fulfilled',isDisabled : false },
        { name:'Cancelled',isDisabled : true },
    ],
    Fulfilled:[
        { name:'New',isDisabled : true },
        { name:'Processing',isDisabled : true },
        { name:'PartiallyFulfilled',isDisabled : true },
        { name:'Fulfilled',isDisabled : true },
        { name:'Cancelled',isDisabled : true },
    ],
    Cancelled:[
        { name:'New',isDisabled : true },
        { name:'Processing',isDisabled : true },
        { name:'PartiallyFulfilled',isDisabled : true },
        { name:'Fulfilled',isDisabled : true },
        { name:'Cancelled',isDisabled : true },
    ]
}


export const WEAVER_PO_STATUS = {
    New: [
        { name: 'New', isDisabled: false },
        { name: 'Processing', isDisabled: false },
        { name: 'Fulfilled', isDisabled: true },
        { name: 'Cancelled', isDisabled: false }
    ],
    Processing: [
        { name: 'New', isDisabled: true },
        { name: 'Processing', isDisabled: false },
        { name: 'Fulfilled', isDisabled: false },
        { name: 'Cancelled', isDisabled: true }
    ],
    Fulfilled: [
        { name: 'New', isDisabled: true },
        { name: 'Processing', isDisabled: true },
        { name: 'Fulfilled', isDisabled: true },
        { name: 'Cancelled', isDisabled: true }
    ],
    Cancelled: [
        { name: 'New', isDisabled: true },
        { name: 'Processing', isDisabled: true },
        { name: 'Fulfilled', isDisabled: true },
        { name: 'Cancelled', isDisabled: true }
    ]
}
