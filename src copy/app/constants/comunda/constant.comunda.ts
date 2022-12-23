// All Approval or reject should happen at one place [ I mean single component].

export const CAMUNDA_CONFIGURATION = {
    
    // Camunda Engine -> does't know any thing about next Assigned To users 
    // Camunda Engine -> will have the information about Task so either we can approve or Reject
    YarnOrderReturn:{
        status:true,// For some cases we will not have status. Ex:- Mudra 
        NEW:{
            rolesBaseUserAPIcall:['YOperationsAgent'],//send Empty if there is no assignment
            detailsPageRoute:`/yarn-orders-return/details`,// This will helps to redirect to details page.
            title:`Approve The Request`,

            //Button Related Config
            buttonsList:[
             { displayName:'Approve',action:'approved',className:'btn btn-primary btn-sm font-weight-bolder font-size-sm py-3 px-6 mr-5 m-1'},
             { displayName:'Reject',action:'reject',className:'btn btn-warning btn-sm font-weight-bolder font-size-sm py-3 px-6 mr-5 m-1'}
            ],
            rejectReasons:[
                { displayName:`Incorrect Bills`,value:"Incorrect Bills"},
                { displayName:`Bill Amount Mismatch`,value:"Bill Amount Mismatch"},
                { displayName:`Defective`,value:"Defective"},
                { displayName:`Product Mismatch`,value:"Product Mismatch"},
                { displayName:`Others`,value:"Others"}
            ]
        },
        APPROVED:{
            rolesBaseUserAPIcall:['LogisticsManager'],//send Empty if there is no assignment
            detailsPageRoute:`/yarn-orders-return/details`,// This will helps to redirect to details page.
            title:`Assign To Logistic Manager`,

            //Button Related Config
            buttonsList:[
             { displayName:'Assign To Logistic Manager',action:'approved',className:'btn btn-primary btn-sm font-weight-bolder font-size-sm py-3 px-6 mr-5 m-1'},
            //  { displayName:'Reject',action:'reject',className:'btn btn-warning btn-sm font-weight-bolder font-size-sm py-3 px-6 mr-5 m-1'}
            ],
            rejectReasons:[
                { displayName:`Incorrect Bills`,value:"Incorrect Bills"},
                { displayName:`Bill Amount Mismatch`,value:"Bill Amount Mismatch"},
                { displayName:`Defective`,value:"Defective"},
                { displayName:`Product Mismatch`,value:"Product Mismatch"},
                { displayName:`Others`,value:"Others"}
            ],
            logisticsRequired:{
                true:{
                    title:`Assign To Logistic Manager`,
                    rolesBaseUserAPIcall:['LogisticsManager'],//send Empty if there is no assignment
                },
                false:{
                    title:`Assign To Yarn Manager`,
                    rolesBaseUserAPIcall:['YOperationsManager'],//send Empty if there is no assignment
 
                },
                defaultValue:true
            }
        },
        REQUEST_FOR_LOGISTICS:{
            rolesBaseUserAPIcall:['YOperationsManager'],//send Empty if there is no assignment
            detailsPageRoute:`/yarn-orders-return/details`,// This will helps to redirect to details page.
            title:`Assign To Yarn Manager`,
            //Button Related Config
            buttonsList:[
             { displayName:'Add Logistic Details',action:'approved',className:'btn btn-primary btn-sm font-weight-bolder font-size-sm py-3 px-6 mr-5 m-1',routeToUpdateDetails:`yarn-orders-return/logistic-crud`},
            //  { displayName:'Reject',action:'reject',className:'btn btn-warning btn-sm font-weight-bolder font-size-sm py-3 px-6 mr-5 m-1'}
            ],
            rejectReasons:[
                { displayName:`Incorrect Bills`,value:"Incorrect Bills"},
                { displayName:`Bill Amount Mismatch`,value:"Bill Amount Mismatch"},
                { displayName:`Defective`,value:"Defective"},
                { displayName:`Product Mismatch`,value:"Product Mismatch"},
                { displayName:`Others`,value:"Others"}
            ],
        },
        SHIPPED:{
            rolesBaseUserAPIcall:[],//send Empty if there is no assignment
            detailsPageRoute:`/yarn-orders-return/details`,// This will helps to redirect to details page.
            title:`Receive Goods Approval`,
            //Button Related Config
            buttonsList:[
             { displayName:'Receive Goods',action:'approved',className:'btn btn-primary btn-sm font-weight-bolder font-size-sm py-3 px-6 mr-5 m-1',routeToUpdateDetails:`/yarn-orders-return/receive-qa-crud`},
            //  { displayName:'Reject',action:'reject',className:'btn btn-warning btn-sm font-weight-bolder font-size-sm py-3 px-6 mr-5 m-1'}
            ],
            rejectReasons:[
                { displayName:`Incorrect Bills`,value:"Incorrect Bills"},
                { displayName:`Bill Amount Mismatch`,value:"Bill Amount Mismatch"},
                { displayName:`Defective`,value:"Defective"},
                { displayName:`Product Mismatch`,value:"Product Mismatch"},
                { displayName:`Others`,value:"Others"}
            ],
        },

    }

}


//Interfaces 
export interface ProcessTaskData{
    entityType:string,
    recordStatus:string,
    entityId:number,
    ACTION_FROM_UI:string,
    externalId:number,
    entityTypeFromUI:string
}

export interface Actions{
    APPROVE_FROM_BUTTON?:string,
    REJECT_FROM_BUTTON?:string,
    // APPROVE_FROM_BUTTON?:string,
  }
  