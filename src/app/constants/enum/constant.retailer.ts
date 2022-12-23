export const SALES_ORDER_RETURN=[
    'NEW',  
    'APPROVED',
    'BACK_TO_INVENTORY',  
    'CANCELLED'
]

export const FULL_FILLMENT_STATUS = [
   'NEW',
   'COMPLETE',
   'PARTIAL',
]/** NEVER CHANGE THE ORDER COLOR WILL DIFFER */

 export const SOR_STATUS={
     CURR_ALL:[
        { name:'NEW',isDisabled : false },
        { name:'APPROVED',isDisabled : false },
        { name:'BACK_TO_INVENTORY',isDisabled : false },
        { name:'CANCELLED',isDisabled : false },
     ],
     CURR_NEW:[
        { name:'NEW',isDisabled : false },
        { name:'APPROVED',isDisabled : true },
        { name:'BACK_TO_INVENTORY',isDisabled : true },
        { name:'CANCELLED',isDisabled : true },
     ],
     CURR_APRROVED:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : false },
        { name:'BACK_TO_INVENTORY',isDisabled : false },
        { name:'CANCELLED',isDisabled : true },
     ],
     CURR_BACK_TO_INVENTORY:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'BACK_TO_INVENTORY',isDisabled : false },
        { name:'CANCELLED',isDisabled : true },
     ],
     CURR_CANCELLED:[
        { name:'NEW',isDisabled : true },
        { name:'APPROVED',isDisabled : true },
        { name:'BACK_TO_INVENTORY',isDisabled : true },
        { name:'CANCELLED',isDisabled : false },
     ],

 }

export const RETURN_REASONS = [
    'DEFECTIVE',
    'INCORRECT_PRODUCT_SHIPPED',
    'CHANGED_MIND',
    'PRODUCT_MISMATCH',
    'INCORRECT_PRODUCT_PURCHASED',
    'EXCESSIVE_PRICE',
    'BETTER_PRICE_ELSEWHERE',
    'LATE_DELIVERY',
    'PRODUCT_NO_LONGER_NEEDED',
    'EXPECTATION_MISMATCH',
    'WARDROBING'
]

export const CANCELLATION_REASONS=[
  'QUANTITY_CORRECTION',

  'CHANGE_RETURN_REASON',

  'ADD_NEW_SKUS'
]

export const UNIT_OF_MESURES = {
   "KGS":{displayName:"kgs",validators:'^-?(([1-9]\\d*)|0)(.0*[1-9]([0-9]){0,2})?$'},
   "METERS":{displayName:"Meters",validators:'^-?(([1-9]\\d*)|0)(.0*[1-9]([0-9]){0,2})?$'},
   "PACS":{displayName:"Packs",validators:"^[0-9]*$"},
   "PCS":{displayName:"Pieces",validators:'^[0-9]*$'},
   "SETS":{displayName:"Sets",validators:'^[0-9]*$'}
}