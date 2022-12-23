import { ROUTER } from "../Router/constant.router";

export const MakerCheckerRoute = {
    SKUBatchAudit1:{
      path:`${ROUTER.SKUBATCH}/${ROUTER.DETAILS}`,
    },
    CocoonOrder:{
      path:`${ROUTER.COCOON_ORDERS}/${ROUTER.DETAILS}`,
    },
    SalesOrderAudit:{
      path:`${ROUTER.RETAILER_ORDERS}/${ROUTER.DETAILS}`,
      approveNotesMandatory:{
        actionName:'Ready for Shipment',
        validator:true,
      }
    },
    WeaverPayoutAudit:{
      path:`${ROUTER.SKUBATCH}/${ROUTER.DETAILS}`,
      route:true
    },
    WeaverReturnOrderAudit:{
      path:`${ROUTER.WEAVER_RETURN}`,
    },
}
// weaver-sku-batch
export const ConfigurationInwardFlow = {
  Logistics:{
    path:'logistics',
  },
  "Order Received":{
    path:'receive-order',
  },
  "Finance Approval":{
   path:'finance'
  },
  "QA":{
    path:'finance'
  }
}

export  const REJECT_REASONS =[
  'Incorrect Bills',
  'Bill Amount Mismatch',
  'Defective',
  'Product Mismatch',
  'Others'
]