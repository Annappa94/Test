interface AutoApproval{
    "id": 5,
    "processType": null,
    "processTypeSequence": null,
    "currentState": null,
    "targetState": null,
    "action": null,
    "requiredRole": null,
    "targetStateId": null,
    "mandatory": false,
    "description": "Logistics Manager Approval",
    "approvalApplicableActions": null,
    "processStatus": null,
    "stateDefinitionExitCheckRules": null,
    "stateDefinitionExitChecks": null
}

interface PopUpDataTransfer{
    item:Item,
    actions:Actions,
    validatePayload:any,
    count:number | string,
    processType: any,
    isRoutePath: boolean,
    entityCode:string
}

interface Item{
    assignedTo: {id: number, name: string, phone: string}
    autoApprovalDefinitions: any
    definition: any
    enabled: boolean
    ownedBy: {id: number, name: string, phone: string}
    pendingAction: string
    stateTransitionExitChecks: []
    transition:Transition
}

interface TransitionPayload{
    transition:Transition,
    assignedTo?: {
        id: number
    }
    ownedBy?:{
        id:number
    },
    autoApprovalDefinitions?:any[]
}

interface Transition{
    actionName:string
    notes: string
    status: string,
    rejectReasons:string[],
    id?:number,
    targetState?:string,
    entityId?:number,
    currentState?:string,
    entityCode?: string,
    processType?:string
}
interface Actions{
  status:string,
  actionName : string
}

interface Assigne{
  id: number
  name: string
  phone: string
}

interface Warning{
 iswarning:Boolean,
 warningMessage:string,
 isEnabledSave:boolean
}

interface Error{
    error:Boolean,
    errors:{level:String,message:string}[],
    warning:Boolean,
    autoApprovalDefinitions:any[]

}

export { AutoApproval, PopUpDataTransfer, TransitionPayload, Actions, Transition, Assigne, Warning,Error,Item};