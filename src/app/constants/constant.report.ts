export const TRANSACTION_REPORT_API=[
    { name:'Iot Sales',ApiEndpoint:'iotsalestransaction?',spec:true, vertical:'RESHAFARMS', division:'IOT'},
    { name:'Chawki Orders',ApiEndpoint:'report/chawkiorder?',spec:true , vertical:'RESHAFARMS', division:'CRC'},
    { name:'Chawki Sales',ApiEndpoint:'report/transactional/chawkisales?',spec:true , vertical:'RESHAFARMS', division:'CRC'},
    { name:'Input Market Place',ApiEndpoint:'farmermarketplace?', vertical:'RESHAFARMS', division:'INPUTS'},
    { name:'Cocoon Purchase',ApiEndpoint:'cocoonlots?',spec:true, vertical:'RESHAFARMS', division:'COCOON'},
    { name:'Cocoon Sales',ApiEndpoint:'cocoonorders?',spec:true, vertical:'RESHAFARMS', division:'COCOON'},
    { name:'Cocoon Logistics',ApiEndpoint:'cocoonlogisticsreport?',spec:true, vertical:'RESHAFARMS', division:'COCOON'},
    { name:'Yarn Purchase',ApiEndpoint:'yarnpurchase/transactional?search=',spec:true, vertical:'RESHAYARNS'},
    { name:'Yarn Bookings',ApiEndpoint:'yarnreport/yarnbooking?',spec:true, vertical:'RESHAYARNS', division: 'YARNLOTS'},
    { name:'Yarn Purchase Returns',ApiEndpoint:'yarnreport/yarnpurchasereturn?',spec:true, vertical:'RESHAYARNS', division: 'YARNLOTS', searchQuery:" and status=in=(TO_BE_RETURNED,RETURN_IN_TRANSIT,RETURNED)"},
    { name:'Yarn Weight Loss',ApiEndpoint:'yarnreport/lotweightlossreport?',spec:true, vertical:'RESHAYARNS', division: 'YARNLOTS'},
    { name:'Yarn Sales',ApiEndpoint:'yarnsales/transactional?',spec:true, vertical:'RESHAYARNS'},
    { name:'Yarn Purchase Logistics',ApiEndpoint:'yarnpurchaselogisticsreport?',spec:true, vertical:'RESHAYARNS'},
    { name:'Yarn Twisting Logistics',ApiEndpoint:'yarntwistinglogisticsreport?',spec:true, vertical:'RESHAYARNS'},
    { name:'Yarn Sales Logistics',ApiEndpoint:'yarnsaleslogisticsreport?',spec:true, vertical:'RESHAYARNS'},
    // { name:'Weaver SKU Batch',ApiEndpoint:'weaverskubatch?'},
    // { name:'Retailers order',ApiEndpoint:'retailersorder?'}, 
    { name:'Weaves Sales Orders',ApiEndpoint:'transactional/salesorder?',spec:true, vertical:'RESHAWEAVES'},
    { name:'Weaves Purchase Returns',ApiEndpoint:'transactional/weaverreturnorder?',spec:true, vertical:'RESHAWEAVES'},
    { name:'Weaves Sales Returns',ApiEndpoint:'transactional/retailersalesorderreturn?',spec:true, vertical:'RESHAWEAVES'},
    { name:'Saree Purchases',ApiEndpoint:'sareepurchase/transactional?',spec:true, vertical:'RESHAWEAVES'},
    { name:'SKU Inventory',ApiEndpoint:'skus?',spec:true, vertical:'RESHAWEAVES'},
    { name:'Sales Order Logistics',ApiEndpoint:'salesorderlogisticsreport?',spec:true, vertical:'RESHAWEAVES'},
	{ name:'Yarn Purchase Performa',ApiEndpoint:'yarnpurchaseperformareport?',spec:true, vertical:'RESHAYARNS'},
    { name:'Categories',ApiEndpoint:'bytype?type=category', vertical:'RESHAWEAVES'},
    { name:'Types',ApiEndpoint:'bytype?type=type', vertical:'RESHAWEAVES'},
    { name:'Tags',ApiEndpoint:'bytype?type=tag', vertical:'RESHAWEAVES'},
    { name:'Followups',ApiEndpoint:'followups?', spec:true, vertical:'CUSTOMERSUCCESS'},
    { name:'Cotton Purchase',ApiEndpoint:'cottonpurchase?',spec:true, vertical:'RESHAFARMS', division:'COTTON'},
    { name:'Cotton Sales',ApiEndpoint:'cottonsales?',spec:true, vertical:'RESHAFARMS', division:'COTTON'},
    { name:'Cotton Bale Purchase',ApiEndpoint:'cottonbalelistingpurchase?',spec:true, vertical:'RESHAFARMS', division:'COTTONBALES'},
    { name:'Cotton Bale Sales',ApiEndpoint:'cottonbalesalesorder?',spec:true, vertical:'RESHAFARMS', division:'COTTONBALES'},
    { name:'Pupae Purchase',ApiEndpoint:'pupaepurchase?',spec:true, vertical:'RESHAFARMS', division:'PUPAE'},
    { name:'Pupae Sales',ApiEndpoint:'pupaesales?',spec:true, vertical:'RESHAFARMS', division:'PUPAE'},
    
]

export const USER_REPORT_API=[
    { name:'Chawki',ApiEndpoint:'chawkis?',spec:true, vertical:'RESHAFARMS', division:'CRC',notEnabled:true},
    { name:'Farmer',ApiEndpoint:'farmers?',spec:true, vertical:'RESHAFARMS', division:'COCOON'},
    { name:'Reeler',ApiEndpoint:'reelers?',spec:true, vertical:'RESHAYARNS'},
    { name:'Weaver',ApiEndpoint:'weavers?',spec:true, vertical:'RESHAWEAVES'},
    { name:'Retailer',ApiEndpoint:'retailers?',spec:true, vertical:'RESHAWEAVES'},
    { name:'Twisting Unit',ApiEndpoint:'twistingunituserreport?',spec:true, vertical:'RESHAYARNS'},
    { name:'Cotton Farmer',ApiEndpoint:'cottonfarmers?',spec:true, vertical:'RESHAFARMS', division:'COTTON'},
    { name:'Ginner Mills',ApiEndpoint:'ginnermills?',spec:true, vertical:'RESHAFARMS', division:'COTTON'}
]

export const PAYMENT_REPORT_API =[
    { name:'Cocoon Purchase',ApiEndpoint:'cocoonpurchase?',spec:true, vertical:'RESHAFARMS', division:'COCOON'},
    { name:'Cocoon Sales',ApiEndpoint:'cocoonsales?',spec:true, vertical:'RESHAFARMS', division:'COCOON'},
    { name:'Yarn Purchase',ApiEndpoint:'yarnpurchase?',spec:true, vertical:'RESHAYARNS'},
    { name:'Yarn Sales',ApiEndpoint:'yarnsales?',spec:true, vertical:'RESHAYARNS'},
    { name:'SKU Purchase',ApiEndpoint:'skupurchase?',spec:true, vertical:'RESHAWEAVES'},
    { name:'SKU Sales',ApiEndpoint:'skusales?',spec:true, vertical:'RESHAWEAVES'},
    { name:'Chawki Sales',ApiEndpoint:'report/payment/chawkisales?',spec:true, vertical:'RESHAFARMS', division:'CRC'},
    { name:'CRC Sales',ApiEndpoint:'report/payment/crcsales?',spec:true, vertical:'RESHAFARMS', division:'CRC'},
    { name:'Ginner Payments',ApiEndpoint:'ginnerpayment?',spec:true, vertical:'RESHAFARMS', division:'COTTON'},
    { name:'Cotton Farmer Payouts',ApiEndpoint:'cottonfarmerspayout?',spec:true, vertical:'RESHAFARMS', division:'COTTON'},
]

export const PNL_REPORT_API = [
    { name:'Cocoon PNL',ApiEndpoint:'cocoonpnl?',spec:true, vertical:'RESHAFARMS', division:'COCOON'},
    { name:'Yarn PNL',ApiEndpoint:'yarnpnl?',spec:true, vertical:'RESHAYARNS'},
    { name:'Sales Order PNL',ApiEndpoint:'salesorderpnl?',spec:true, vertical:'RESHAWEAVES'},
    { name:'Chawki PNL',ApiEndpoint:'report/chawkipnl?',spec:true, vertical:'RESHAFARMS', division:'CRC'},
]

export const INVENTORY_REPORT_API = [
    { name:'ReshaWeaves Inventory',ApiEndpoint:'inventory/reshaweaves?',spec:true, vertical:'RESHAWEAVES'},
]

export const COLLECTION_REPORT_API = [
    { name:'ReshaWeaves Collection',ApiEndpoint:'collection/v4report?',spec:true,searchQuery:`and paymentStatus != 'Paid'&sort=dueDate,desc`,datePlaceHolder:'dueDate', vertical:'RESHAWEAVES'},
    { name:'ReshaYarn Collection',ApiEndpoint:'collection/v3report?',spec:true,searchQuery:`and orderPaymentStatus != 'Paid'&sort=dueDate,desc`,datePlaceHolder:'dueDate', vertical:'RESHAYARNS'},
    { name:'ReshaFarms Collection',ApiEndpoint:'collection/v2report?',spec:true,searchQuery:`and orderPaymentStatus != 'Paid'&sort=dueDate,desc`,datePlaceHolder:'dueDate', vertical:'RESHAFARMS'},
]

export const MUDRA_REPORT_API = [
    { name:'Loan Ledger',ApiEndpoint:'creditlinesvc/report/loanledgers?',spec:true, vertical:'MUDRA',microService:true},
    { name:'Loans',ApiEndpoint:'creditlinesvc/report/loanreports?',spec:true, vertical:'MUDRA',microService:true},
]

export const REPORT = {
    user:{
       report:USER_REPORT_API,
       title:'User Reports'
    },
    transactional:{
       report:TRANSACTION_REPORT_API,
       title:'Transactional Reports'
    },
    payment:{
       report:PAYMENT_REPORT_API,
       title:'Payments Reports '
    },
    pnl:{
       report:PNL_REPORT_API,
       title:'PNL Reports'
    },
    Inventory:{
        report:INVENTORY_REPORT_API,
        title:'Inventory Reports'
    },
    collection:{
        report:COLLECTION_REPORT_API,
        title:'Collection Reports',
        futureFilter:true
    },
    mudra:{
        report:MUDRA_REPORT_API,
        title:'Mudra Reports',
        hideSearch:true,
        isMudraFilter:true
    }
}

export const VERTICALS = [
    {
        name: "RESHA FARMS",
        enum: "RESHAFARMS",
        isEligibleforCentre:true,
        divisions : [
            {"name": "COCOON","enum": "COCOON"},
            {"name": "RAW COTTON", "enum": "COTTON"},
            {"name": "COTTON BALES", "enum": "COTTONBALES"},
            {"name": "CRC","enum": "CRC"},
            {"name": "TUSSAR","enum": "TUSSAR"},
            {"name": "PUPAE","enum": "PUPAE"},
            {"name": "IOT","enum": "IOT"},
            {"name": "INPUTS","enum": "INPUTS"},

        ]
    },
    {
        name: "RESHA YARNS",
        enum: "RESHAYARNS",
        isEligibleforCentre:true,
        divisions : [
        ]
    },
    {
        name: "RESHA WEAVES",
        enum: "RESHAWEAVES",
        isEligibleforCentre:true,
        divisions : [
        ]
    },
    {
        name: "CUSTOMER SUCCESS",
        enum: "CUSTOMERSUCCESS",
        isEligibleforCentre:false,
        divisions : [
        ]
    }
]
   